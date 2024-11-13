"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const referral_1 = __importDefault(require("../../model/referral"));
const subscription_1 = __importDefault(require("../../model/subscription"));
const user_1 = __importDefault(require("../../model/user"));
const helpers_1 = require("../../utility/helpers");
const service_error_1 = require("../../utility/service-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cards_1 = __importDefault(require("../../model/cards"));
const charge_card_1 = require("../../service/stripe/charge-card");
const numeral_1 = __importDefault(require("numeral"));
const transaction_1 = __importDefault(require("../../model/transaction"));
const paypal_1 = require("../../service/paypal");
const http_status_codes_1 = require("http-status-codes");
const notifications_1 = __importDefault(require("../../model/notifications"));
const cloudinary_1 = __importDefault(require("../../service/cloudinary"));
class Service {
    async profile(id) {
        const user = await user_1.default.findById(id).select("-password").populate("cleaner", "-docs");
        if (!user)
            throw new service_error_1.BadRequestException("user not found");
        return { message: "User profile retrieved successfully", data: user };
    }
    async update(payload, user_id) {
        let user = await user_1.default.findById(user_id);
        if (!user)
            throw new service_error_1.BadRequestException("user not found");
        if ("avatar" in payload) {
            const result = await cloudinary_1.default.uploader.upload(payload.avatar, { folder: '/profile_pics' });
            if (!result)
                throw new service_error_1.BadRequestException("Couldn't upload docs, please try again");
            payload.avatar = result.secure_url;
        }
        user = await user_1.default.findByIdAndUpdate(user_id, {
            first_name: payload === null || payload === void 0 ? void 0 : payload.first_name,
            last_name: payload === null || payload === void 0 ? void 0 : payload.last_name,
            avatar: (payload === null || payload === void 0 ? void 0 : payload.avatar) || user.avatar,
            phone_number: payload === null || payload === void 0 ? void 0 : payload.phone_number
        }, { new: true });
        return { message: "User profile updated successfully", data: user };
    }
    async changePassword(payload, user_id) {
        let user = await user_1.default.findById(user_id);
        if (!user)
            throw new service_error_1.BadRequestException("user not found");
        const is_match = await bcrypt_1.default.compare(payload.old_password, user.password);
        if (!is_match)
            throw new service_error_1.BadRequestException(`Incorrect password`);
        const password = await (0, helpers_1.hashPassword)(payload.new_password);
        await user.updateOne({ password });
        return { message: "Password updated successfully", data: null };
    }
    async referral(user) {
        const referrals = await referral_1.default.find({ user });
        const balance = referrals.filter(r => !r.completed).reduce((acc, r) => {
            return acc += r.reward;
        }, 0);
        const data = {
            num_of_invites: referrals.length,
            balance
        };
        return { message: "Referral stats retrieved successfully", data };
    }
    async subscribe(res, payload, id) {
        const { method } = payload;
        const user = await user_1.default.findById(id);
        if (!user)
            throw new service_error_1.BadRequestException("user not found");
        const sub = new subscription_1.default({
            amount: 10,
            currency: "usd",
            user: id,
            payment_method: method,
            due_at: (0, dayjs_1.default)().add(30, "days")
        });
        if ((0, helpers_1.compareStrings)(method, "wallet")) {
            if (user.balance < sub.amount) {
                throw new service_error_1.BadRequestException("Insufficient balance, please fund your wallet");
            }
            user.balance = (0, numeral_1.default)(user.balance).subtract(sub.amount).value();
            await user.save();
            sub.status = "active";
            await transaction_1.default.create({
                user: user.id,
                status: "successful",
                narration: "Tidyplus subscription",
                amount: sub.amount,
                type: "charge"
            });
            await sub.save();
            return (0, helpers_1.responsHandler)(res, "Subscripton payment completed", http_status_codes_1.StatusCodes.OK, null);
        }
        else if ((0, helpers_1.compareStrings)(method, "card")) {
            const card = await cards_1.default.findById(payload.card);
            if (!card)
                throw new service_error_1.NotFoundException("card not found");
            const result = await (0, charge_card_1.chargeCard)({
                amount: sub.amount,
                payment_method: card.reference,
                metadata: { sub: sub.id }
            });
            sub.metadata = { payment: result.id };
            await sub.save();
            //TODO: handle the webhook
            return (0, helpers_1.responsHandler)(res, "Processing payment...", http_status_codes_1.StatusCodes.CREATED, null);
        }
        else if ((0, helpers_1.compareStrings)(payload.method, "paypal")) {
            (0, paypal_1.createSubscription)(10, async (err, result) => {
                if (err) {
                    throw new service_error_1.ServiceError(err.message, err.httpStatusCode, err.response.details);
                }
                else {
                    sub.metadata = { payment: result.id };
                    await sub.save();
                    return (0, helpers_1.responsHandler)(res, "Processing payment...", http_status_codes_1.StatusCodes.CREATED, { link: result.link, id: result.id });
                }
            });
        }
        else {
            throw new service_error_1.BadRequestException("Payment method not supported");
        }
        await sub.save();
    }
    async cancelSub(payload, user) {
        await subscription_1.default.updateMany({ user, status: "active" }, { note: payload === null || payload === void 0 ? void 0 : payload.note, status: "cancelled" });
        return { message: "Subscription cancelled successfully", data: null };
    }
    async subStatus(user) {
        const data = await subscription_1.default.findOne({ user });
        return { message: "Subscription status retrieved successfully", data };
    }
    async notifications(id, pagination) {
        const user = await user_1.default.findById(id);
        if (!user)
            throw new service_error_1.NotFoundException("User not found");
        const data = await notifications_1.default.paginate({
            recipient: { $in: ["all", id] },
            created_at: { $gt: user.created_at }
        }, {
            ...pagination,
            sort: { created_at: "desc" }
        });
        return { data, message: "Notifications retrieved successfully" };
    }
}
exports.default = new Service;
//# sourceMappingURL=service.js.map
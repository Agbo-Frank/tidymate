"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cleaner_1 = __importDefault(require("../../model/cleaner"));
const referral_1 = __importDefault(require("../../model/referral"));
const user_1 = __importDefault(require("../../model/user"));
const mail_1 = __importDefault(require("../../service/mail"));
const helpers_1 = require("../../utility/helpers");
const jwt_1 = __importDefault(require("../../utility/jwt"));
const service_error_1 = require("../../utility/service-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
class Service {
    async login(payload) {
        const { email, password } = payload;
        let user = await user_1.default.findOne({ email });
        if (!user)
            throw new service_error_1.NotFoundException("User not found");
        const is_match = await bcrypt_1.default.compare(password, user.password);
        if (!is_match)
            throw new service_error_1.BadRequestException(`Incorrect password`);
        const token = jwt_1.default.create({ roles: user.roles, id: user === null || user === void 0 ? void 0 : user.id });
        const data = {
            token,
            user: {
                ...user.toJSON(),
                kyc_required: false
            },
            role: "homeowner"
        };
        if (!(0, helpers_1.isEmpty)(user.cleaner)) {
            const cleaner = await cleaner_1.default.findById(user.cleaner);
            data.role = 'cleaner';
            data.user.kyc_required = cleaner.isverified();
            //@ts-ignore
            // data.user.cleaner = cleaner
        }
        return { message: "User login successful", data };
    }
    async register(payload) {
        const { email, first_name, last_name, phone_number, referral_code } = payload;
        let user = await user_1.default.findOne({ email });
        if (user)
            throw new service_error_1.BadRequestException("User already exist");
        const password = await (0, helpers_1.hashPassword)(payload.password);
        user = new user_1.default({
            email, first_name,
            last_name, phone_number,
            password,
            referral_code: (0, helpers_1.randAlphaNum)(8)
        });
        if (!(0, helpers_1.isEmpty)(referral_code)) {
            const referrer = await user_1.default.findOne({ referral_code });
            if (referrer) {
                await referral_1.default.create({ user: referrer.id, referee: user.id });
            }
        }
        if ((0, helpers_1.compareStrings)(payload.type, "cleaner")) {
            const cleaner = await cleaner_1.default.create({ user: user.id });
            user.cleaner = cleaner.id;
        }
        await user.save();
        await mail_1.default.sendOTP(email);
        return { message: "Registration successful", data: null };
    }
    async verifyOtp(payload) {
        const { email, code } = payload;
        const user = await user_1.default.findOne({ email });
        if (!user)
            throw new service_error_1.NotFoundException("User not found");
        await mail_1.default.verifyOTP(email, code);
        if (!user.email_verified) {
            await user.updateOne({ email_verified: true });
            await referral_1.default.updateOne({ referee: user.id }, { reward: 100 });
        }
        const data = jwt_1.default.create({ id: user === null || user === void 0 ? void 0 : user.id, roles: user.roles }, { expiresIn: 60 * 10 });
        return { message: "Verification successful", data };
    }
    async resetPassword(payload, user) {
        const password = await (0, helpers_1.hashPassword)(payload.password);
        await user_1.default.updateOne({ _id: user }, { password });
        return { message: "Password reset successfully", data: null };
    }
}
exports.default = new Service();
//# sourceMappingURL=service.js.map
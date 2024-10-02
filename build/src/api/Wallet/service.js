"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cards_1 = __importDefault(require("../../model/cards"));
const transaction_1 = __importDefault(require("../../model/transaction"));
const paypalv2_1 = require("../../service/paypalv2");
const charge_card_1 = require("../../service/stripe/charge-card");
const helpers_1 = require("../../utility/helpers");
const service_error_1 = require("../../utility/service-error");
const user_1 = __importDefault(require("../../model/user"));
class Service {
    //@ts-ignore
    async deposit(payload, user_id) {
        const { amount, method } = payload;
        const user = await user_1.default.findById(user_id);
        if (!user)
            throw new service_error_1.NotFoundException("User not found");
        let data = null;
        const tx = new transaction_1.default({
            amount, type: "funding",
            user: user.id,
            payment_method: method
        });
        if ((0, helpers_1.compareStrings)(method, "card")) {
            const card = await cards_1.default.findById(payload.card);
            if (!card)
                throw new service_error_1.NotFoundException("card not found");
            const result = await (0, charge_card_1.chargeCard)({
                amount,
                payment_method: card.reference,
                metadata: { tx: tx.id }
            });
            tx.payment_ref = result === null || result === void 0 ? void 0 : result.id;
            //TODO: handle the webhook
        }
        else if ((0, helpers_1.compareStrings)(method, "paypal")) {
            const result = await (0, paypalv2_1.createPayment)({
                amount, reference: `WAL-${tx.id.slice(-8)}`,
                description: "Tidymate Wallet Funding",
                callback_url: payload === null || payload === void 0 ? void 0 : payload.callback_url
            });
            const link = result.links.find(l => (0, helpers_1.compareStrings)(l.rel, "payer-action"));
            tx.payment_ref = result === null || result === void 0 ? void 0 : result.id;
            data = link ? { link: link === null || link === void 0 ? void 0 : link.href } : null;
        }
        else {
            throw new service_error_1.BadRequestException("Payment method not supported");
        }
        await tx.save();
        return { message: "Deposit initiated successfully", data };
    }
    withdraw() { }
    async transactions(user, { limit, page }) {
        const data = await transaction_1.default.paginate({ user }, { page, limit, sort: { updated_at: "desc" } });
        return { message: "Transaction retrieve successfully", data };
    }
}
exports.default = new Service();
//# sourceMappingURL=service.js.map
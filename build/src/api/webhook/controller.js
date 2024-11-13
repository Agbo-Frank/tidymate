"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = __importDefault(require("../../model/transaction"));
const service_error_1 = require("../../utility/service-error");
const order_1 = __importDefault(require("../../model/order"));
const helpers_1 = require("../../utility/helpers");
const numeral_1 = __importDefault(require("numeral"));
const user_1 = __importDefault(require("../../model/user"));
const paypalv2_1 = require("../../service/paypalv2");
const events = [
    "CHECKOUT.ORDER.APPROVED",
    "PAYMENT.CAPTURE.COMPLETED",
    "CHECKOUT.PAYMENT-APPROVAL.REVERSED"
];
class Controller {
    async paypal(req, res) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const { event_type, resource } = req.body;
            if ((0, helpers_1.isEmpty)(event_type) || !events.includes(event_type))
                return res.status(200);
            let custom_id = null;
            let order_id = null;
            if ((0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.status, "APPROVED")) {
                const unit = resource === null || resource === void 0 ? void 0 : resource.purchase_units.find(u => (0, helpers_1.compareStrings)(u === null || u === void 0 ? void 0 : u.reference_id, "default"));
                custom_id = unit.custom_id;
                order_id = resource === null || resource === void 0 ? void 0 : resource.id;
            }
            if ((0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.status, "COMPLETED")) {
                custom_id = resource === null || resource === void 0 ? void 0 : resource.custom_id;
                order_id = (_b = (_a = resource === null || resource === void 0 ? void 0 : resource.supplementary_data) === null || _a === void 0 ? void 0 : _a.related_ids) === null || _b === void 0 ? void 0 : _b.order_id;
            }
            if (custom_id.startsWith("WAL-")) {
                const tx = await transaction_1.default.findOne({ payment_ref: order_id });
                if (!tx || (tx === null || tx === void 0 ? void 0 : tx.status) !== "pending") {
                    throw new service_error_1.BadRequestException("Bad request");
                }
                if ((0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.status, "APPROVED") &&
                    (0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.intent, "CAPTURE")) {
                    await (0, paypalv2_1.capturePayment)(resource === null || resource === void 0 ? void 0 : resource.id);
                }
                if ((0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.status, "COMPLETED")) {
                    const amount = (_d = (_c = resource === null || resource === void 0 ? void 0 : resource.seller_receivable_breakdown) === null || _c === void 0 ? void 0 : _c.net_amount) === null || _d === void 0 ? void 0 : _d.value;
                    const fee = (_f = (_e = resource === null || resource === void 0 ? void 0 : resource.seller_receivable_breakdown) === null || _e === void 0 ? void 0 : _e.paypal_fee) === null || _f === void 0 ? void 0 : _f.value;
                    tx.status = "successful";
                    tx.fee = (0, numeral_1.default)(fee).value();
                    await user_1.default.updateOne({ _id: tx.user }, { $inc: { balance: (0, numeral_1.default)(amount).value() }
                    });
                    await tx.save();
                }
            }
            if (custom_id.startsWith("ORD-")) {
                const order = await order_1.default.findOne({ payment_ref: order_id });
                if (!order)
                    throw new service_error_1.NotFoundException("Order not found");
                if ((0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.status, "APPROVED"))
                    order.paid = "initialized";
                else if ((0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.status, "COMPLETED"))
                    order.paid = "completed";
                else
                    order.paid = "pending";
                await order.save();
            }
            return res.status(200);
        }
        catch (error) {
            console.log(error);
            return res.status(200);
        }
    }
}
exports.default = new Controller();
//# sourceMappingURL=controller.js.map
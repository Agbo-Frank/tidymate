"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executePayment = void 0;
const _1 = __importDefault(require("."));
function executePayment(amount, payer_id, payment_id, cb) {
    const payload = {
        payer_id,
        "transactions": [{
                "amount": { "currency": "USD", "total": String(amount) }
            }]
    };
    return _1.default.payment.execute(payment_id, payload, function (error, payment) {
        if (error)
            return cb(error, null);
        else
            return cb(null, payment);
    });
}
exports.executePayment = executePayment;
//# sourceMappingURL=execute-payment.js.map
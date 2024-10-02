"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = void 0;
const _1 = __importStar(require("."));
const helpers_1 = require("../../utility/helpers");
function createPayment(amount, description, resources, cb) {
    const payload = {
        "intent": "sale",
        "payer": { "payment_method": "paypal" },
        "redirect_urls": {
            "return_url": `${_1.callback_url}/${resources}/success`,
            "cancel_url": `${_1.callback_url}/${resources}/failed`
        },
        "transactions": [{
                "item_list": {
                    "items": [{
                            "name": "Tidymates service",
                            "sku": "item",
                            "price": String(amount),
                            "currency": "USD",
                            "quantity": 1
                        }]
                },
                "amount": { "currency": "USD", "total": String(amount) },
                description
            }]
    };
    return _1.default.payment.create(payload, function (error, payment) {
        if (error)
            return cb(error, null);
        else {
            const link = payment.links.find(link => (0, helpers_1.compareStrings)(link.rel, "approval_url"));
            JSON.stringify(payment, null, 2);
            return cb(null, { link: link.href, id: payment.id });
        }
    });
}
exports.createPayment = createPayment;
//# sourceMappingURL=create-payment.js.map
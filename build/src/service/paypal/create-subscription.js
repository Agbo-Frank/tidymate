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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = void 0;
const _1 = __importStar(require("."));
const helpers_1 = require("../../utility/helpers");
const dayjs_1 = __importDefault(require("dayjs"));
function createSubscription(amount = 10, cb) {
    const payload = {
        "description": "Subscription plan for Tidyplus",
        "merchant_preferences": {
            "auto_bill_amount": "yes",
            "cancel_url": `${_1.callback_url}/subscription/failed`,
            "initial_fail_amount_action": "continue",
            "max_fail_attempts": "3",
            "return_url": `${_1.callback_url}/subscription/success`,
            "setup_fee": { "currency": "USD", "value": "1" }
        },
        "name": "Tidymate",
        "payment_definitions": [
            {
                "amount": { "currency": "USD", "value": String(amount) },
                "cycles": "0",
                "frequency": "MONTH",
                "frequency_interval": "1",
                "name": "Tidyplus plan",
                "type": "REGULAR"
            }
        ],
        "type": "INFINITE"
    };
    return _1.default.billingPlan.create(payload, function (error, plan) {
        if (error)
            return cb(error, null);
        _1.default.billingPlan.update(plan.id, [{ "op": "replace", "path": "/", "value": { "state": "ACTIVE" } }], (error, response) => {
            if (error)
                return cb(error, null);
            const agreement_payload = {
                name: "Fast Speed Agreement",
                description: "Agreement for Fast Speed Plan",
                start_date: (0, dayjs_1.default)().add(4, "seconds"),
                plan: { id: plan.id },
                payer: { payment_method: "paypal" }
            };
            _1.default.billingAgreement.create(agreement_payload, (error, payment) => {
                if (error)
                    return cb(error, null);
                console.log("Agreement: ", payment);
                const link = payment.links.find(link => (0, helpers_1.compareStrings)(link.rel, "approval_url"));
                return cb(null, { link: link.href, id: payment.id });
            });
        });
    });
}
exports.createSubscription = createSubscription;
//# sourceMappingURL=create-subscription.js.map
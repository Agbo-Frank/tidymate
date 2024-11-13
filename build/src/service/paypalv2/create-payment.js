"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = void 0;
const numeral_1 = __importDefault(require("numeral"));
const client_1 = __importDefault(require("./client"));
const service_error_1 = require("../../utility/service-error");
/**
 * the intent can be CAPTURE or AUTHORIZE
 * CAPTURE is for instant capture of payment like initiating an immediate payment
 * AUTHORIZE is for authorizing payment  that will need to be captured later
 */
async function createPayment({ reference, amount, description, callback_url, intent = "AUTHORIZE" }) {
    try {
        const _url = (status) => {
            const [url, search] = callback_url.split("?");
            const params = new URLSearchParams(search);
            params.append("status", status);
            return url + "?" + params.toString();
        };
        const payload = {
            intent,
            "purchase_units": [
                {
                    "custom_id": reference,
                    "amount": { "currency_code": "USD", "value": (0, numeral_1.default)(amount).format("0.00") },
                    description
                }
            ],
            "payment_source": {
                "paypal": {
                    "experience_context": {
                        "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                        "brand_name": "Tidymates",
                        "locale": "en-US",
                        "landing_page": "NO_PREFERENCE",
                        "user_action": "PAY_NOW",
                        "return_url": _url("success"),
                        "cancel_url": _url("cancel")
                    }
                }
            }
        };
        const { data } = await client_1.default.post("/checkout/orders", payload);
        return data;
    }
    catch (error) {
        console.log(error);
        throw new service_error_1.ProviderError("paypal", error);
    }
}
exports.createPayment = createPayment;
//# sourceMappingURL=create-payment.js.map
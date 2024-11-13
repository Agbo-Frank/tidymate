"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capturePayment = void 0;
const service_error_1 = require("../../utility/service-error");
const client_1 = __importDefault(require("./client"));
async function capturePayment(id) {
    try {
        const { data } = await client_1.default.post(`checkout/orders/${id}/capture`);
        return data;
    }
    catch (error) {
        console.log(error);
        throw new service_error_1.ProviderError("paypal", error);
    }
}
exports.capturePayment = capturePayment;
//# sourceMappingURL=capture-payment.js.map
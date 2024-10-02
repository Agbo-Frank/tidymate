"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chargeCard = void 0;
const service_error_1 = require("../../utility/service-error");
const client_1 = __importDefault(require("./client"));
async function chargeCard(payload) {
    try {
        const result = await client_1.default.post("/payment_intents", { confirm: true, ...payload });
        return result === null || result === void 0 ? void 0 : result.data;
    }
    catch (error) {
        throw new service_error_1.ProviderError("stripe", error);
    }
}
exports.chargeCard = chargeCard;
//# sourceMappingURL=charge-card.js.map
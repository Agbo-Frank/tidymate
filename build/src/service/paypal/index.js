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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callback_url = void 0;
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const config_1 = require("../../utility/config");
paypal_rest_sdk_1.default.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': String(config_1.PAYPAL_CLIENT_ID),
    'client_secret': String(config_1.PAYPAL_CLIENT_SECRET)
});
exports.default = paypal_rest_sdk_1.default;
exports.callback_url = "https://c209-102-90-66-90.ngrok-free.app/callback/paypal";
__exportStar(require("./create-payment"), exports);
__exportStar(require("./create-subscription"), exports);
__exportStar(require("./execute-payment"), exports);
__exportStar(require("./execute-subscription"), exports);
//# sourceMappingURL=index.js.map
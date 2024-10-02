"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../utility/config");
const helpers_1 = require("../../utility/helpers");
const access_token = Buffer.from(`${config_1.PAYPAL_CLIENT_ID}:${config_1.PAYPAL_CLIENT_SECRET}`).toString('base64');
const client = axios_1.default.create({
    baseURL: (0, helpers_1.compareStrings)(config_1.NODE_ENV, "production") ? "" : "https://api-m.sandbox.paypal.com/v2",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${access_token}`
    },
});
exports.default = client;
//# sourceMappingURL=client.js.map
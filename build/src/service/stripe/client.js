"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../utility/config");
const client = axios_1.default.create({
    baseURL: "https://api.stripe.com/v1",
    headers: {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': "Bearer " + config_1.STRIPE_APIKEY
    },
});
exports.default = client;
//# sourceMappingURL=client.js.map
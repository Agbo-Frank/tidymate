"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocoder = exports.charge = exports.pagingParams = exports.responsHandler = exports.validateRequest = exports.hashPassword = exports.maskEmail = exports.isEmpty = exports.compareStrings = exports.randAlphaNum = exports.randNum = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const service_error_1 = require("./service-error");
const numeral_1 = __importDefault(require("numeral"));
const transaction_1 = __importDefault(require("../model/transaction"));
const cards_1 = __importDefault(require("../model/cards"));
const charge_card_1 = require("../service/stripe/charge-card");
const paypal_1 = require("../service/paypal");
const user_1 = __importDefault(require("../model/user"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
function randNum(len = 4) {
    const numbers = '0123456789';
    let randomCode = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        randomCode += numbers.charAt(randomIndex);
    }
    return randomCode;
}
exports.randNum = randNum;
const randAlphaNum = (len = 6) => {
    const char = 'ABCDEFGHIJKLMNOPQRSUVWXYZ0123456789';
    let randomCode = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * char.length);
        randomCode += char.charAt(randomIndex);
    }
    return randomCode;
};
exports.randAlphaNum = randAlphaNum;
const compareStrings = (str1, str2) => {
    return (str1 === null || str1 === void 0 ? void 0 : str1.toLowerCase().trim()) === (str2 === null || str2 === void 0 ? void 0 : str2.toLowerCase().trim());
};
exports.compareStrings = compareStrings;
const isEmpty = (mixedVar) => {
    let undef;
    let key;
    let i;
    let len;
    const emptyValues = [undef, null, false, 0, '', '0', 'null', 'undefined'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i] || typeof mixedVar == 'undefined') {
            return true;
        }
    }
    if (typeof mixedVar === 'object' && !(mixedVar instanceof Date)) {
        for (key in mixedVar) {
            if (mixedVar.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    return false;
};
exports.isEmpty = isEmpty;
const maskEmail = (email) => {
    const [username, domain] = email.split('@');
    const mask = username.slice(0, 4) + '*'.repeat(Math.floor(username.length / 2)) + username.charAt(username.length - 1);
    return mask + '@' + domain;
};
exports.maskEmail = maskEmail;
const hashPassword = async (password) => {
    let salt = await bcrypt_1.default.genSalt(10);
    return await bcrypt_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
const validateRequest = (req) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        let message = errors.array()[0].msg;
        throw new service_error_1.UnprocessableContent(message, errors.array());
    }
};
exports.validateRequest = validateRequest;
const responsHandler = (res, message, status = 200, data = null) => {
    res.status(status).json({
        status: /^4/.test(status.toString()) ? "failed" : "success",
        message,
        data
    });
};
exports.responsHandler = responsHandler;
const pagingParams = (req) => {
    let { limit, page, paginate } = req.query;
    limit = limit ? parseInt(`${limit}`) : 25;
    page = page ? parseInt(`${page}`) < 1 ? 1 : parseInt(`${page}`) : 1;
    return { limit, page, pagination: paginate };
};
exports.pagingParams = pagingParams;
const charge = async (method, payload, cb) => {
    try {
        if ((0, exports.compareStrings)(method, "wallet")) {
            const wallet = await user_1.default.findById(payload.user);
            if (wallet.balance < payload.amount) {
                throw new service_error_1.BadRequestException("Insufficient balance, please fund your wallet");
            }
            wallet.balance = (0, numeral_1.default)(wallet.balance).subtract(payload.amount).value();
            await wallet.save();
            const tx = await transaction_1.default.create({
                wallet: wallet.id,
                status: "successful",
                amount: payload.amount,
                narration: payload.description,
                type: "charge"
            });
            cb(null, tx);
        }
        else if ((0, exports.compareStrings)(method, "card")) {
            const card = await cards_1.default.findById(payload.card);
            if (!card)
                throw new service_error_1.NotFoundException("card not found");
            const result = await (0, charge_card_1.chargeCard)({
                amount: payload.amount,
                payment_method: card.reference,
                metadata: payload.metadata
            });
            cb(null, result);
        }
        else if ((0, exports.compareStrings)(method, "paypal")) {
            (0, paypal_1.createPayment)(payload.amount, payload.description, payload.resources, async (err, result) => {
                if (err) {
                    throw new service_error_1.ServiceError(err.message, err.httpStatusCode, err.response.details);
                }
                else
                    return cb(null, result);
            });
        }
        else
            throw new service_error_1.BadRequestException("Payment method not supported");
    }
    catch (error) {
        return cb(error, null);
    }
};
exports.charge = charge;
const geocoder = async (payload) => {
    var _a, _b;
    try {
        const params = new URLSearchParams();
        params.append("key", config_1.GOOGLE_API_KEY);
        if (typeof payload === "string") {
            params.append("address", payload);
        }
        else
            params.append("latlng", payload.join(","));
        const { data } = await axios_1.default.get("https://maps.googleapis.com/maps/api/geocode/json?" + params.toString());
        if ((data === null || data === void 0 ? void 0 : data.status) !== "OK")
            throw new service_error_1.BadRequestException(data === null || data === void 0 ? void 0 : data.error_message);
        const { formatted_address, geometry } = data.results[0];
        return {
            formatted_address,
            coordinates: [(_a = geometry === null || geometry === void 0 ? void 0 : geometry.location) === null || _a === void 0 ? void 0 : _a.lat, (_b = geometry === null || geometry === void 0 ? void 0 : geometry.location) === null || _b === void 0 ? void 0 : _b.lng]
        };
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.geocoder = geocoder;
//# sourceMappingURL=helpers.js.map
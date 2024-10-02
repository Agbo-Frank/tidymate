"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../utility/helpers");
const service_1 = __importDefault(require("./service"));
const http_status_codes_1 = require("http-status-codes");
const mail_1 = __importDefault(require("../../service/mail"));
class Controller {
    async login(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.login(req.body);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.register(req.body);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            next(error);
        }
    }
    async sendOTP(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message } = await mail_1.default.sendOTP(req.body.email);
            return (0, helpers_1.responsHandler)(res, message);
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.resetPassword(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.verifyOtp(req.body);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new Controller;
//# sourceMappingURL=controller.js.map
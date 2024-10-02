"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const helpers_1 = require("../../utility/helpers");
const service_1 = __importDefault(require("./service"));
class Controller {
    async orders(req, res, next) {
        try {
            const { message, data } = await service_1.default.orders(req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async profile(req, res, next) {
        try {
            const { message, data } = await service_1.default.profile(req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async getCleaners(req, res, next) {
        try {
            const { message, data } = await service_1.default.getCleaners(req.query);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async setLocation(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.setLocation(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async uploadDocs(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.uploadDocs(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async kycStatus(req, res, next) {
        try {
            const { message, data } = await service_1.default.kycStatus(req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async requestKit(req, res, next) {
        try {
            const { message, data } = await service_1.default.requestKit(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async accept(req, res, next) {
        try {
            const { message, data } = await service_1.default.accept(req.params.id, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async cancel(req, res, next) {
        try {
            const { message, data } = await service_1.default.cancel(req.params.id, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async start(req, res, next) {
        try {
            const { message, data } = await service_1.default.start(req.params.id, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async end(req, res, next) {
        try {
            const { message, data } = await service_1.default.end(req.params.id, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = new Controller();
//# sourceMappingURL=controller.js.map
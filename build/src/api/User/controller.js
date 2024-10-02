"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../utility/helpers");
const service_1 = __importDefault(require("./service"));
const http_status_codes_1 = require("http-status-codes");
class Controller {
    async profile(req, res, next) {
        try {
            const { message, data } = await service_1.default.profile(req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.update(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message } = await service_1.default.changePassword(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message);
        }
        catch (error) {
            next(error);
        }
    }
    async subscribe(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            return service_1.default.subscribe(res, req.body, req.user);
        }
        catch (error) {
            next(error);
        }
    }
    async subStatus(req, res, next) {
        try {
            const { message, data } = await service_1.default.subStatus(req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async cancelSub(req, res, next) {
        try {
            const { message, data } = await service_1.default.cancelSub(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async notifications(req, res, next) {
        try {
            const { message, data } = await service_1.default.notifications(req.user, (0, helpers_1.pagingParams)(req));
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new Controller;
//# sourceMappingURL=controller.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../utility/helpers");
const service_1 = __importDefault(require("./service"));
const http_status_codes_1 = require("http-status-codes");
class Controller {
    async create(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.create(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
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
            console.log(error);
            next(error);
        }
    }
    async reorder(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.reorder(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            next(error);
        }
    }
    async addCleaners(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.addCleaners(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async review(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.review(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            next(error);
        }
    }
    async tip(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.tip(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            next(error);
        }
    }
    async getOrders(req, res, next) {
        try {
            const { message, data } = await service_1.default.getOrders(req.query, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async getOrder(req, res, next) {
        try {
            const { message, data } = await service_1.default.getOrder(req.params.id, req.user);
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
            next(error);
        }
    }
    async complete(req, res, next) {
        try {
            const { message, data } = await service_1.default.complete(req.params.id, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async processPayment(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.processPayment(req.body, req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new Controller();
//# sourceMappingURL=controller.js.map
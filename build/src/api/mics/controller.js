"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../utility/helpers");
const service_1 = __importDefault(require("./service"));
const http_status_codes_1 = require("http-status-codes");
class Controller {
    async autoCompleteSearch(req, res, next) {
        try {
            (0, helpers_1.validateRequest)(req);
            const { message, data } = await service_1.default.autoCompleteSearch(req.body);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
    async history(req, res, next) {
        try {
            const { message, data } = await service_1.default.history(req.user);
            return (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.OK, data);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new Controller();
//# sourceMappingURL=controller.js.map
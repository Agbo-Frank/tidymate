"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const helpers_1 = require("../../utility/helpers");
const service_1 = __importDefault(require("./service"));
class Controller {
    async deposit(req, res, next) {
        try {
            const { message, data } = await service_1.default.deposit(req.body, req.user);
            (0, helpers_1.responsHandler)(res, message, http_status_codes_1.StatusCodes.CREATED, data);
        }
        catch (error) {
            next(error);
        }
    }
    // async withdraw(req: any, res: Response, next: NextFunction) {
    //   try {
    //     const { message, data } = await service.withdraw(req.user)
    //     return responsHandler(res, message, StatusCodes.OK, data)
    //   } catch (error) {
    //     next(error)
    //   }
    // } 
    async transactions(req, res, next) {
        try {
            const { message, data } = await service_1.default.transactions(req.user, (0, helpers_1.pagingParams)(req));
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
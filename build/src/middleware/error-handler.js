"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_error_1 = require("../utility/service-error");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utility/logger"));
const logger = new logger_1.default("error");
const ErrorHandler = async (err, _, res, next) => {
    process.on('uncaughtException', (reason) => {
        logger.log("uncaught Exception", reason);
        throw reason; // need to take care
    });
    process.on('unhandledRejection', error => {
        logger.log("uncaught Rejection", error);
        throw error; // need to take care
    });
    if (err) {
        if (err instanceof service_error_1.ServiceError) {
            return res.status(err.statusCode).json({
                status: err === null || err === void 0 ? void 0 : err.status,
                message: err === null || err === void 0 ? void 0 : err.message,
                data: err === null || err === void 0 ? void 0 : err.data
            });
        }
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "failed",
            message: "Internal server error",
            data: null
        });
    }
    next();
};
exports.default = ErrorHandler;
//# sourceMappingURL=error-handler.js.map
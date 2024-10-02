"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderError = exports.Logintimeout = exports.UnprocessableContent = exports.ActionNotAllowed = exports.TooManyRequestsException = exports.NotFoundException = exports.ServiceUnavailableException = exports.ExpectationFailedException = exports.InternalServerErrorException = exports.UnauthorizedException = exports.BadRequestException = exports.ServiceError = void 0;
const axios_1 = require("axios");
const http_status_codes_1 = require("http-status-codes");
class ServiceError extends Error {
    constructor(message, statusCode, data = null, status = "failed", errorStack) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = status;
        this.statusCode = statusCode;
        this.data = data;
        this.errorStack = errorStack;
        Error.captureStackTrace(this);
    }
}
exports.ServiceError = ServiceError;
class BadRequestException extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.BAD_REQUEST, data, "failed");
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.UNAUTHORIZED, data, "failed");
    }
}
exports.UnauthorizedException = UnauthorizedException;
class InternalServerErrorException extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, data, "failed");
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
class ExpectationFailedException extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.EXPECTATION_FAILED, data, "failed");
    }
}
exports.ExpectationFailedException = ExpectationFailedException;
class ServiceUnavailableException extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE, data, "failed");
    }
}
exports.ServiceUnavailableException = ServiceUnavailableException;
class NotFoundException extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.NOT_FOUND, data, "failed");
    }
}
exports.NotFoundException = NotFoundException;
class TooManyRequestsException extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS, data, "failed");
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
class ActionNotAllowed extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.FORBIDDEN, data, "failed");
    }
}
exports.ActionNotAllowed = ActionNotAllowed;
class UnprocessableContent extends ServiceError {
    constructor(message, data) {
        super(message, http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, data, "failed");
    }
}
exports.UnprocessableContent = UnprocessableContent;
class Logintimeout extends ServiceError {
    constructor(message, data) {
        super(message, 440, data, "failed");
    }
}
exports.Logintimeout = Logintimeout;
class ProviderError extends Error {
    constructor(service, errorStack) {
        var _a, _b;
        super(((_b = (_a = errorStack === null || errorStack === void 0 ? void 0 : errorStack.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || (errorStack === null || errorStack === void 0 ? void 0 : errorStack.message));
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = 400;
        if (errorStack instanceof axios_1.AxiosError) {
            const error_res = errorStack.response;
            this.statusCode = error_res.status;
            if ((error_res === null || error_res === void 0 ? void 0 : error_res.status) === 401) {
                this.statusCode = 500;
                this.message = "Internal server error";
                // trigger.sendEvent({
                //   name: "send.email",
                //   payload: {
                //     to: ["agbofrank531@gmail.com"],
                //     subject: `Puplar Error Log (${service} - service)`,
                //     text: `From ${service}: ${errorStack}`
                //   }
                // })
            }
        }
        this.status = "failed";
        this.data = null;
        this.errorStack = errorStack;
        Error.captureStackTrace(this);
    }
}
exports.ProviderError = ProviderError;
//# sourceMappingURL=service-error.js.map
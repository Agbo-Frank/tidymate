export declare class ServiceError extends Error {
    statusCode: number;
    status: string;
    data: any;
    errorStack: any;
    constructor(message: string, statusCode: number, data?: any, status?: "failed" | "success", errorStack?: any);
}
export declare class BadRequestException extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class UnauthorizedException extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class InternalServerErrorException extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class ExpectationFailedException extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class ServiceUnavailableException extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class NotFoundException extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class TooManyRequestsException extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class ActionNotAllowed extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class UnprocessableContent extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class Logintimeout extends ServiceError {
    constructor(message: string, data?: any);
}
export declare class ProviderError extends Error {
    statusCode: number;
    status: string;
    data: any;
    message: string;
    errorStack: any;
    constructor(service: string, errorStack?: any);
}

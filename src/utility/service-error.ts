import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
  
export class ServiceError extends Error {
  statusCode: number
  status: string
  data: any
  errorStack: any

  constructor(
    message: string,
    statusCode: number,
    data: any = null,
    status: "failed" | "success" = "failed",
    errorStack?: any
  ){
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.status = status;
    this.statusCode = statusCode;
    this.data = data
    this.errorStack = errorStack

    Error.captureStackTrace(this);
  }
}

export class BadRequestException extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.BAD_REQUEST, 
      data,
      "failed",
    );
  }
}
  
export class UnauthorizedException extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.UNAUTHORIZED,
      data,
      "failed"
    );
  }
}

export class InternalServerErrorException extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.INTERNAL_SERVER_ERROR, 
      data,
      "failed"
    );
  }
}

export class ExpectationFailedException extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.EXPECTATION_FAILED, 
      data,
      "failed"
    );
  }
}

export class ServiceUnavailableException extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.SERVICE_UNAVAILABLE, 
      data,
      "failed"
    );
  }
}

export class NotFoundException extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.NOT_FOUND, 
      data,
      "failed"
    );
  }
}

export class TooManyRequestsException extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.TOO_MANY_REQUESTS, 
      data,
      "failed"
    );
  }
}

export class ActionNotAllowed extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.FORBIDDEN, 
      data,
      "failed"
    );
  }
}

export class UnprocessableContent extends ServiceError {
  constructor(message: string, data?: any) {
    super(
      message, 
      StatusCodes.UNPROCESSABLE_ENTITY, 
      data,
      "failed"
    );
  }
}

export class Logintimeout extends ServiceError {
  constructor(message: string, data?: any) {
    super(message, 440, data, "failed");
  }
}

export class ProviderError extends Error {
  statusCode: number
  status: string
  data: any
  message: string;
  errorStack: any

  constructor(service: string, errorStack?: any){
    super(errorStack?.response?.data?.message || errorStack?.message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = 400

    if (errorStack instanceof AxiosError) {
      const error_res = errorStack.response;

      this.statusCode = error_res.status

      if(error_res?.status === 401){
        this.statusCode = 500
        this.message = "Internal server error"

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
    this.data = null
    this.errorStack = errorStack

    Error.captureStackTrace(this);
  }
}
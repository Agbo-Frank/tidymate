import { NextFunction, Request, Response } from "express";
import { ServiceError } from "../utility/service-error";
import { StatusCodes } from "http-status-codes";
import Logger from "../utility/logger";

const logger = new Logger("error")

const ErrorHandler = async (err: ServiceError, _: Request, res: Response, next: NextFunction): Promise<any> => { 

  process.on('uncaughtException', (reason) => {
    logger.log("uncaught Exception", reason)
    throw reason; // need to take care
  })

  process.on('unhandledRejection', error => {
    logger.log("uncaught Rejection", error as any)
    throw error; // need to take care
  })
    
  if(err){
      if(err instanceof ServiceError){
        return res.status(err.statusCode).json({
          status: err?.status,
          message: err?.message,
          data: err?.data
        })
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: "failed",
          message: "Internal server error",
          data: null
      })
  }
  next();
}

export default ErrorHandler
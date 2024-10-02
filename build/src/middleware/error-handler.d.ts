import { NextFunction, Request, Response } from "express";
import { ServiceError } from "../utility/service-error";
declare const ErrorHandler: (err: ServiceError, _: Request, res: Response, next: NextFunction) => Promise<any>;
export default ErrorHandler;

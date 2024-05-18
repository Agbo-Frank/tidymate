import { NextFunction, Request, Response } from "express";
import { validateRequest } from "../utility/helpers";
import { header } from "express-validator";
import jwt from "../utility/jwt";

export default function guard(req: Request, res: Response, next: NextFunction){
  try{
    validateRequest(req);
    const token = req.header('authorization');

    const decoded = jwt.verify(token);
    
    req.user = decoded?.id;
    // req.role = decoded?.role;
    next();
  }
  catch(error){
    next(error);
  }
}

export const guardValid= header("authorization")
  .notEmpty().withMessage("Token is required")
  .custom(value => value?.startsWith('Bearer')).withMessage("Invalid token, it must start with Bearer") 
  .customSanitizer(value => value?.replace('Bearer ', ''))
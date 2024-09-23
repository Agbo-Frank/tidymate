import { NextFunction, Request, Response } from "express";
import { validateRequest } from "../utility/helpers";
import { header } from "express-validator";
import jwt from "../utility/jwt";

export default function guard(req: any, _: Response, next: NextFunction){
  try{
    validateRequest(req);
    const token = req.header('authorization');

    const decoded = jwt.verify(token);
    
    req.user = decoded?.id;
    next();
  }
  catch(error){
    console.log(error)
    next(error);
  }
}

export const guardValid= header("authorization")
  .notEmpty().withMessage("Token is required")
  .customSanitizer(value => value?.replace('Bearer ', ''))
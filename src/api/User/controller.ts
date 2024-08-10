import { Request, Response, NextFunction } from "express";
import { pagingParams, responsHandler, validateRequest } from "../../utility/helpers";
import service from "./service";
import { StatusCodes } from "http-status-codes";

class Controller {

  async profile(req: any, res: Response, next: NextFunction){
    try {
      const { message, data } = await service.profile(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }

  async update(req: any, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message, data } = await service.update(req.body, req.user)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req: any, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message } = await service.changePassword(req.body, req.user)

      return responsHandler(res, message)
    } catch (error) {
      next(error)
    }
  }

  async subscribe(req: any, res: Response, next: NextFunction){
    try {
      validateRequest(req)
      
      return service.subscribe(res, req.body, req.user)
    } catch (error) {
      next(error)
    }
  }

  async notifications(req: any, res: Response, next: NextFunction){
    try {
      const { message, data } = await service.notifications(req.user, pagingParams(req))

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controller
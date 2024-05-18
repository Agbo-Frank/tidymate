import { Request, Response, NextFunction } from "express";
import { responsHandler, validateRequest } from "../../utility/helpers";
import service from "./service";
import { StatusCodes } from "http-status-codes";
import mail from "../../service/mail";

class Controller {

  async profile(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message, data } = await service.profile(req.user)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message, data } = await service.update(req.body, req.user)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message } = await service.changePassword(req.body, req.user)

      return responsHandler(res, message)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controller
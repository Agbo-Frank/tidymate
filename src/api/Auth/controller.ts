import { Request, Response, NextFunction } from "express";
import { responsHandler, validateRequest } from "../../utility/helpers";
import service from "./service";
import { StatusCodes } from "http-status-codes";
import mail from "../../service/mail";

class Controller {

  async login(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message, data } = await service.login(req.body)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }

  async register(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message, data } = await service.register(req.body)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async sendOTP(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message } = await mail.sendOTP(req.body.email)

      return responsHandler(res, message)
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message, data } = await service.resetPassword(req.body, req.user)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)

      const { message, data } = await service.verifyOtp(req.body)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controller
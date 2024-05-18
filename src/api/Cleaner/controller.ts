import { StatusCodes } from "http-status-codes"
import { responsHandler } from "../../utility/helpers"
import service from "./service"
import { NextFunction, Response, Request } from "express"

class Controller {
  async orders(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.orders(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.profile(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async getCleaners(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.getCleaners(req.query)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 
}

export default new Controller()
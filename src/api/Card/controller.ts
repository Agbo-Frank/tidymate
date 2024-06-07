import { NextFunction, Response } from "express"
import { responsHandler, validateRequest } from "../../utility/helpers"
import service from "./service"
import { StatusCodes } from "http-status-codes"

class Controller {

  async create(req: any, res: Response, next: NextFunction) {
    try {
      validateRequest(req)
      const { message, data } = await service.create(req.body, req.user)
      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  } 
  async list(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.list(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async del(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.del(req.params.id, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 
}

export default new Controller()
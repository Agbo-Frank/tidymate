import { NextFunction, Response } from "express"
import { responsHandler, validateRequest } from "../../utility/helpers"
import service from "./service"
import { StatusCodes } from "http-status-codes"

class Controller {
  async autoCompleteSearch(req: any, res: Response, next: NextFunction) {
    try {
      validateRequest(req)
      const { message, data } = await service.autoCompleteSearch(req.body)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 
  async history(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.history(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 
}

export default new Controller()
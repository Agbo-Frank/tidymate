import { StatusCodes } from "http-status-codes"
import { responsHandler, validateRequest } from "../../utility/helpers"
import service from "./service"
import { NextFunction, Response, Request } from "express"

class Controller {
  async deposit(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.deposit(req.body, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  // async withdraw(req: any, res: Response, next: NextFunction) {
  //   try {
  //     const { message, data } = await service.withdraw(req.user)
  //     return responsHandler(res, message, StatusCodes.OK, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // } 

  async transactions(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.transactions(req.user, req.query)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  } 
}

export default new Controller()
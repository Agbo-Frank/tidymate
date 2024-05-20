import { StatusCodes } from "http-status-codes"
import { responsHandler, validateRequest } from "../../utility/helpers"
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
  async setLocation(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequest(req)
      const { message, data } = await service.setLocation(req.body, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }
  
  async uploadDocs(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequest(req)
      const { message, data } = await service.uploadDocs(req.body, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async kycStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.kycStatus(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 
}

export default new Controller()
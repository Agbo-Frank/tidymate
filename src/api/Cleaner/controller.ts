import { StatusCodes } from "http-status-codes"
import { responsHandler, validateRequest } from "../../utility/helpers"
import service from "./service"
import { NextFunction, Response, Request } from "express"

class Controller {
  async orders(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.orders(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async pendingOrders(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.pendingOrders()
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async profile(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.profile(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async getCleaners(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.getCleaners(req.query)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  } 
  async setLocation(req: any, res: Response, next: NextFunction) {
    try {
      validateRequest(req)
      const { message, data } = await service.setLocation(req.body, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }
  
  async uploadDocs(req: any, res: Response, next: NextFunction) {
    try {
      validateRequest(req)
      const { message, data } = await service.uploadDocs(req.body, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async kycStatus(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.kycStatus(req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async requestKit(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.requestKit(req.body, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 
  async accept(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.accept(req.params.id, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async decline(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.decline(req.params.id, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  } 

  async cancel(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.cancel(req.params.id, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  } 

  async start(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.start(req.params.id, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  } 

  async end(req: any, res: Response, next: NextFunction) {
    try {
      const { message, data } = await service.end(req.params.id, req.user)
      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  } 
}

export default new Controller()
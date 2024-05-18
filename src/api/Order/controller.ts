import { Request, Response, NextFunction } from "express";
import { responsHandler, validateRequest } from "../../utility/helpers";
import service from "./service";
import { StatusCodes } from "http-status-codes";

class Controller {
  
  async create(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)
      
      const { message, data } = await service.create(req.body, req.user)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)
      
      const { message, data } = await service.reorder(req.body, req.user)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async addCleaners(req: Request, res: Response, next: NextFunction){
    try {
      validateRequest(req)
      
      const { message, data } = await service.addCleaners(req.body, req.user)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction){
    try {
      const { message, data } = await service.getOrders(req.user)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controller()
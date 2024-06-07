import { Request, Response, NextFunction } from "express";
import { responsHandler, validateRequest } from "../../utility/helpers";
import service from "./service";
import { StatusCodes } from "http-status-codes";

class Controller {
  
  async create(req: any, res: Response, next: NextFunction){
    try {
      validateRequest(req)
    
      const { message, data } = await service.create(req.body, req.user)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async reorder(req: any, res: Response, next: NextFunction){
    try {
      validateRequest(req)
      
      const { message, data } = await service.reorder(req.body, req.user)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async addCleaners(req: any, res: Response, next: NextFunction){
    try {
      validateRequest(req)
      
      const { message, data } = await service.addCleaners(req.body, req.user)

      return responsHandler(res, message, StatusCodes.CREATED, data)
    } catch (error) {
      next(error)
    }
  }

  async getOrders(req: any, res: Response, next: NextFunction){
    try {
      const { message, data } = await service.getOrders(req.user)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }

  async getOrder(req: any, res: Response, next: NextFunction){
    try {
      const { message, data } = await service.getOrder(req.params.id, req.user)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }

  async cancel(req: any, res: Response, next: NextFunction){
    try {
      const { message, data } = await service.cancel(req.params.id, req.user)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }

  async processPayment(req: any, res: Response, next: NextFunction){
    try {
      validateRequest(req)
      
      const { message, data } = await service.processPayment(req.body, req.user)

      return responsHandler(res, message, StatusCodes.OK, data)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controller()
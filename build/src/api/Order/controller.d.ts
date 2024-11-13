import { Response, NextFunction } from "express";
declare class Controller {
    create(req: any, res: Response, next: NextFunction): Promise<void>;
    update(req: any, res: Response, next: NextFunction): Promise<void>;
    reorder(req: any, res: Response, next: NextFunction): Promise<void>;
    review(req: any, res: Response, next: NextFunction): Promise<void>;
    tip(req: any, res: Response, next: NextFunction): Promise<void>;
    getOrders(req: any, res: Response, next: NextFunction): Promise<void>;
    getOrder(req: any, res: Response, next: NextFunction): Promise<void>;
    getOrderCleaners(req: any, res: Response, next: NextFunction): Promise<void>;
    cancel(req: any, res: Response, next: NextFunction): Promise<void>;
    complete(req: any, res: Response, next: NextFunction): Promise<void>;
    processPayment(req: any, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: Controller;
export default _default;

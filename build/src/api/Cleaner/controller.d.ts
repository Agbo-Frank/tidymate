import { NextFunction, Response } from "express";
declare class Controller {
    orders(req: any, res: Response, next: NextFunction): Promise<void>;
    pendingOrders(req: any, res: Response, next: NextFunction): Promise<void>;
    profile(req: any, res: Response, next: NextFunction): Promise<void>;
    getCleaners(req: any, res: Response, next: NextFunction): Promise<void>;
    setLocation(req: any, res: Response, next: NextFunction): Promise<void>;
    uploadDocs(req: any, res: Response, next: NextFunction): Promise<void>;
    kycStatus(req: any, res: Response, next: NextFunction): Promise<void>;
    requestKit(req: any, res: Response, next: NextFunction): Promise<void>;
    accept(req: any, res: Response, next: NextFunction): Promise<void>;
    decline(req: any, res: Response, next: NextFunction): Promise<void>;
    cancel(req: any, res: Response, next: NextFunction): Promise<void>;
    start(req: any, res: Response, next: NextFunction): Promise<void>;
    end(req: any, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: Controller;
export default _default;

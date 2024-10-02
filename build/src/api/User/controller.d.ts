import { Response, NextFunction } from "express";
declare class Controller {
    profile(req: any, res: Response, next: NextFunction): Promise<void>;
    update(req: any, res: Response, next: NextFunction): Promise<void>;
    changePassword(req: any, res: Response, next: NextFunction): Promise<void>;
    subscribe(req: any, res: Response, next: NextFunction): Promise<void>;
    subStatus(req: any, res: Response, next: NextFunction): Promise<void>;
    cancelSub(req: any, res: Response, next: NextFunction): Promise<void>;
    notifications(req: any, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: Controller;
export default _default;

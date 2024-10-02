import { NextFunction, Response } from "express";
declare class Controller {
    deposit(req: any, res: Response, next: NextFunction): Promise<void>;
    transactions(req: any, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: Controller;
export default _default;

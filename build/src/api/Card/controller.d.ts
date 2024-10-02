import { NextFunction, Response } from "express";
declare class Controller {
    create(req: any, res: Response, next: NextFunction): Promise<void>;
    list(req: any, res: Response, next: NextFunction): Promise<void>;
    del(req: any, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: Controller;
export default _default;

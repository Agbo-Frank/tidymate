import { NextFunction, Response } from "express";
declare class Controller {
    autoCompleteSearch(req: any, res: Response, next: NextFunction): Promise<void>;
    getDirection(req: any, res: Response, next: NextFunction): Promise<void>;
    history(req: any, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: Controller;
export default _default;

import { Response } from "express";
declare class Controller {
    paypal(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: Controller;
export default _default;

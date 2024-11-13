import { Request, Response, NextFunction } from "express";
declare class Controller {
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    loginWithGoogle(req: any, res: Response, next: NextFunction): Promise<void>;
    getGoogleProfile(req: any, res: Response, next: NextFunction): Promise<void>;
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendOTP(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: any, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: Controller;
export default _default;

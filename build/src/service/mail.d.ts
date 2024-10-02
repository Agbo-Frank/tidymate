import { MailOptions } from "nodemailer/lib/sendmail-transport";
declare class MailService {
    private config;
    constructor();
    send(payload: MailOptions): Promise<void>;
    sendOTP(email: string): Promise<{
        message: string;
    }>;
    verifyOTP(email: string, entered_code: string): Promise<boolean>;
}
declare const _default: MailService;
export default _default;

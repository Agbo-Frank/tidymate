"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../utility/config");
const redis_1 = __importDefault(require("./redis"));
const service_error_1 = require("../utility/service-error");
const helpers_1 = require("../utility/helpers");
const user_1 = __importDefault(require("../model/user"));
class MailService {
    constructor() {
        this.config = nodemailer_1.default.createTransport({
            //@ts-ignore
            host: config_1.MAIL_HOST,
            port: config_1.MAIL_PORT,
            secure: true,
            auth: {
                user: config_1.MAIL_USER,
                pass: config_1.MAIL_PASS,
            }
        });
    }
    async send(payload) {
        try {
            await this.config.sendMail(payload);
        }
        catch (error) {
            //TODO: handle failed messages
            console.log(error);
        }
    }
    async sendOTP(email) {
        try {
            const user = await user_1.default.findOne({ email });
            if (!user)
                throw new service_error_1.NotFoundException("User not found");
            const key = `otp:${email}`;
            const code = (0, helpers_1.randNum)();
            const result = await this.config.sendMail({
                from: config_1.MAIL_USER,
                to: email,
                subject: "OTP Verification",
                text: `${code}`
            });
            console.log(result);
            await redis_1.default.SET(key, JSON.stringify({ code }), { EX: 10 * 60, NX: true });
            return { message: "OTP sent to yout mail " + (0, helpers_1.maskEmail)(email) };
        }
        catch (error) {
            console.log(error);
            if (error instanceof service_error_1.ServiceError)
                throw error;
            return { message: `Failed to send OTP, verify this email ${(0, helpers_1.maskEmail)(email)} is correct` };
        }
    }
    async verifyOTP(email, entered_code) {
        const key = `otp:${email}`;
        const payload = await redis_1.default.GET(key);
        if (!payload)
            throw new service_error_1.BadRequestException("OTP has expired");
        const { code } = JSON.parse(payload);
        if (entered_code !== code)
            throw new service_error_1.BadRequestException("Incorrect password");
        await redis_1.default.DEL(key);
        return true;
    }
}
exports.default = new MailService();
//# sourceMappingURL=mail.js.map
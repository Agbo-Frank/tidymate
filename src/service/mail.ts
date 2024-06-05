import nodemailer from "nodemailer"
import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER } from "../utility/config";
import redis from "./redis"
import { BadRequestException, NotFoundException, ServiceError } from "../utility/service-error";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { maskEmail, randNum } from "../utility/helpers";
import User from "../model/user";
class MailService {
  private config

  constructor(){
    this.config = nodemailer.createTransport({
      //@ts-ignore
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: true,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      }
    });
  }

  async send(payload: MailOptions){
    try {
      await this.config.sendMail(payload)
    } catch (error) {
      //TODO: handle failed messages
      console.log(error)
    }
  }

  async sendOTP(email: string){
    try {
      const user = await User.findOne({email})
      if(!user) throw new NotFoundException("User not found")

      const key = `otp:${email}`;
      const code = randNum()

      const result = await this.config.sendMail({
        from: MAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `${code}`
      })
      console.log(result)
      await redis.SET(key, JSON.stringify({ code }), { EX: 10 * 60, NX: true })
      return { message: "OTP sent to yout mail " + maskEmail(email) }
    } catch (error: any) {
      console.log(error)
      if(error instanceof ServiceError) throw error
      return { message: `Failed to send OTP, verify this email ${maskEmail(email)} is correct`}
    }
  }

  async verifyOTP(email: string, entered_code: string){
    const key = `otp:${email}`;
    const payload = await redis.GET(key);
    if(!payload) throw new BadRequestException("OTP has expired");

    const { code } = JSON.parse(payload)
    if(entered_code !== code) throw new BadRequestException("Incorrect password");

    await redis.DEL(key);
    return true
  }
}

export default new MailService()
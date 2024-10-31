import { google } from "googleapis";
import Cleaner from "../../model/cleaner";
import Referral from "../../model/referral";
import User from "../../model/user";
import mail from "../../service/mail";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../utility/config";
import { compareStrings, hashPassword, isEmpty, randAlphaNum } from "../../utility/helpers";
import jwt from "../../utility/jwt";
import { BadRequestException, NotFoundException } from "../../utility/service-error";
import { ILogin, IRegister, IVerifyOtp } from "./interface";
import bcrypt from "bcrypt"

class Service {

  async login(payload: ILogin){
    const { email, password } = payload
    let user = await User.findOne({ email })
    if(!user) throw new NotFoundException("User not found");

    const is_match = await bcrypt.compare(password, user.password)
    if(!is_match) throw new BadRequestException(`Incorrect password`);
  
    const token = jwt.create({roles: user.roles, id: user?.id})
    const data = { 
      token, 
      user: {
        ...user.toJSON(),
        kyc_required: false
      }, 
      role: "homeowner" 
    }

    if(!isEmpty(user.cleaner)){
      const cleaner = await Cleaner.findById(user.cleaner)
      data.role = 'cleaner'
      data.user.kyc_required = cleaner.isverified()
      //@ts-ignore
      // data.user.cleaner = cleaner
    }

    return { message: "User login successful", data }
  }

  async loginWithGoogle({ redirect_url}){
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      redirect_url
    );

    const url = oauth2Client.generateAuthUrl({ scope: "https://www.googleapis.com/auth/userinfo.profile" })
    return { message: "", data: { url }}
  }

  async getGoogleProfile({ code }) {
    const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });

    const { data } = await oauth2.userinfo.get();
    let user = await User.findOne({ email: data.email })
    if(!user){
      user = await User.create({
        email: data.email,
        first_name: data.given_name,
        last_name: data.given_name,
        gender: data?.gender,
        email_verified: true,
        referral_code: randAlphaNum(8),
        provider: ['google']
      })
    }

    const token = jwt.create({roles: user.roles, id: user?.id})
    const result = { 
      token,
      user: {
        ...user.toJSON(),
        kyc_required: false
      }, 
      role: user?.roles || "homeowner" 
    }

    return { message: "User signin successful", data: result }
  }

  async register(payload: IRegister){
    const { email, first_name, last_name, phone_number, referral_code} = payload
    let user = await User.findOne({ email })
    if(user)throw new BadRequestException("User already exist");

    const password = await hashPassword(payload.password)
  
    user = new User({ 
      email, first_name, 
      last_name, phone_number,
      password,
      provider: ["password"],
      referral_code: randAlphaNum(8)
    })

    if(!isEmpty(referral_code)){
      const referrer = await User.findOne({ referral_code })
      if(referrer) {
        await Referral.create({user: referrer.id, referee: user.id})
      }
    }

    if(compareStrings(payload.type, "cleaner")){
      const cleaner = await Cleaner.create({ user: user.id })
      user.cleaner = cleaner.id
    }

    await user.save()
    await mail.sendOTP(email)

    return { message: "Registration successful", data: null}
  }

  async verifyOtp(payload: IVerifyOtp){
    const { email, code } = payload
    const user = await User.findOne({ email })
    if(!user) throw new NotFoundException("User not found");

    await mail.verifyOTP(email, code)

    if(!user.email_verified) {
      await user.updateOne({email_verified: true})
      await Referral.updateOne({ referee: user.id }, { reward: 100 })
    }

    const data = jwt.create({id: user?.id, roles: user.roles}, {expiresIn: 60 * 10})

    return { message: "Verification successful", data }
  }

  async resetPassword(payload, user: string){
    const password = await hashPassword(payload.password)

    await User.updateOne({ _id: user }, { password })

    return { message: "Password reset successfully", data: null }
  }
}

export default new Service()
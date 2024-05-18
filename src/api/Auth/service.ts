import Cleaner from "../../model/cleaner";
import Referral from "../../model/referral";
import User from "../../model/user";
import Wallet from "../../model/wallet";
import mail from "../../service/mail";
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
  
    const data = jwt.create({roles: user.roles, id: user?.id})

    return { message: "User login successful", data }
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
      referral_code: randAlphaNum(8)
    })
    const wallet = new Wallet({user: user.id})

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
    await wallet.save()

    await mail.sendOTP(email)

    return { message: "", data: null}
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
  }
}

export default new Service()
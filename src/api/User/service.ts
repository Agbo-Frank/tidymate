import dayjs from "dayjs";
import Referral from "../../model/referral";
import Subscription from "../../model/subscription";
import User, { IUser } from "../../model/user"
import { compareStrings, hashPassword, responsHandler } from "../../utility/helpers";
import { BadRequestException, NotFoundException, ServiceError } from "../../utility/service-error"
import { IChangePassword } from "./interface";
import bcrypt from "bcrypt"
import Card from "../../model/cards";
import { chargeCard } from "../../service/stripe/charge-card";
import Wallet from "../../model/wallet";
import numeral from "numeral";
import Transaction from "../../model/transaction";
import { createPayment, createSubscription } from "../../service/paypal";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import Notification from "../../model/notifications";
import { IPagination } from "../../utility/interface";

class Service {
  async profile(id: string){
    const user = await User.findById(id).select("-password")
    if(!user) throw new BadRequestException("user not found");

    //TODO: Add the subscription status

    return { message: "User profile retrieved successfully", data: user}
  }

  async update(payload: Partial<IUser>, user_id: string){
    let user = await User.findById(user_id)
    if(!user) throw new BadRequestException("user not found");

    user = await User.findByIdAndUpdate(user_id, {
      first_name: payload?.first_name,
      last_name: payload?.last_name,
      phone_number: payload?.phone_number
    }, { new: true})

    return { message: "User profile updated successfully", data: user}
  }

  async changePassword(payload: IChangePassword, user_id: string){
    let user = await User.findById(user_id)
    if(!user) throw new BadRequestException("user not found");

    const is_match = await bcrypt.compare(payload.old_password, user.password)
    if(!is_match) throw new BadRequestException(`Incorrect password`);

    const password = await hashPassword(payload.new_password)

    await user.updateOne({ password })

    return { message: "Password updated successfully", data: null}
  }

  async referral(user: string){
    const referrals = await Referral.find({ user })
    const balance = referrals.filter(r => !r.completed).reduce((acc, r) => {
      return acc += r.reward
    }, 0)

    const data = {
      num_of_invites: referrals.length,
      balance
    }

    return { message: "Referral stats retrieved successfully", data}
  }

  async subscribe(res: Response, payload: any, id: string){
    const { method } = payload

    const user = await User.findById(id)
    if(!user) throw new BadRequestException("user not found");

    const sub = new Subscription({
      amount: 10,
      currency: "usd", 
      payment_method: method, 
      due_at: dayjs().add(30, "days")
    })

    if(compareStrings(method, "wallet")){
      const wallet = await Wallet.findOne({ user })
      if(wallet.balance < sub.amount){
        throw new BadRequestException("Insufficient balance, please fund your wallet")
      }
      wallet.balance = numeral(wallet.balance).subtract(sub.amount).value()
      await wallet.save()
      
      sub.status = "active"

      await Transaction.create({
        wallet: wallet.id,
        status: "successful",
        narration: "Tidyplus subscription",
        amount: sub.amount,
        type: "charge"
      })

      return responsHandler(
        res, 
        "Subscripton payment completed", 
        StatusCodes.OK, 
        null
      )
    }

    else if(compareStrings(method, "card")){
      const card = await Card.findById(payload.card)
      if(!card) throw new NotFoundException("card not found");
      
      const result = await chargeCard({
        amount: sub.amount, 
        payment_method: card.reference,
        metadata: { sub: sub.id }
      })
      sub.metadata = { payment: result.id }
      await sub.save()
      //TODO: handle the webhook

      return responsHandler(
        res, 
        "Processing payment...", 
        StatusCodes.CREATED, 
        null
      )
    }
    else if(compareStrings(payload.method, "paypal")){
      createSubscription(10, async (err, result) => {
        if(err){
          throw new ServiceError(err.message, err.httpStatusCode, err.response.details)
        }
        else {
          sub.metadata = { payment: result.id }
          await sub.save()

          return responsHandler(
            res, 
            "Processing payment...", 
            StatusCodes.CREATED, 
            { link: result.link, id: result.id }
          )
        }
      })
    }
    else {
      throw new BadRequestException("Payment method not supported")
    }
    
    await sub.save()
  }

  async notifications(id: string, pagination: IPagination){
    const user = await User.findById(id)
    if(!user) throw new NotFoundException("User not found");

    const data = await Notification.paginate(
      {
        recipient: {$in: ["all", id]},
        created_at: {$gt: user.created_at}
      }, 
      { 
        ...pagination, 
        sort: { created_at: "desc" }
      }
    )

    return { data, message: "Notifications retrieved successfully"}
  }
}

export default new Service
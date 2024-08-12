import bcrypt from "bcrypt"
import { validationResult } from "express-validator";
import { BadRequestException, NotFoundException, ServiceError, UnprocessableContent } from "./service-error";
import { Response, Request } from "express"
import { IChargePayload } from "./interface";
import numeral from "numeral";
import Transaction from "../model/transaction";
import Card from "../model/cards";
import { chargeCard } from "../service/stripe/charge-card";
import { createPayment } from "../service/paypal";
import User from "../model/user";
import axios from "axios";
import { GOOGLE_API_KEY } from "./config";

export function randNum(len = 4){
  const numbers = '0123456789'
  let randomCode = '';

  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomCode += numbers.charAt(randomIndex);
  }

  return randomCode;
}

export const randAlphaNum = (len = 6) => {
  const char = 'ABCDEFGHIJKLMNOPQRSUVWXYZ0123456789'
  let randomCode = '';

  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * char.length);
    randomCode += char.charAt(randomIndex);
  }

  return randomCode;
}

export const compareStrings = (str1: string, str2: string) => {
  return str1?.toLowerCase().trim() === str2?.toLowerCase().trim();
}

export const isEmpty = (mixedVar: any) => {
  let undef;
  let key;
  let i;
  let len;
  const emptyValues = [undef, null, false, 0, '', '0', 'null', 'undefined'];

  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i] || typeof mixedVar == 'undefined') {
      return true;
    }
  }

  if (typeof mixedVar === 'object' && !(mixedVar instanceof Date)) {
      for (key in mixedVar) {
        if (mixedVar.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
  }
  return false;
};

export const maskEmail = (email: string) => {
  const [username, domain] = email.split('@');
  const mask = username.slice(0, 4) + '*'.repeat(Math.floor(username.length / 2)) + username.charAt(username.length - 1);
  return mask + '@' +  domain
}

export const hashPassword = async (password: string) => {
  let salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const validateRequest = (req: Request) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let message = errors.array()[0].msg
    throw new UnprocessableContent(message, errors.array())
  }
}

export const responsHandler = (res: Response, message: string, status: number = 200, data: any = null) => {
  res.status(status).json({
    status: /^4/.test(status.toString()) ? "failed" : "success",
    message,
    data
  })
}

export const pagingParams = (req: Request) => {
  let { limit, page, paginate }: {limit?: string | number, page?: string | number, paginate?: boolean} = req.query
  limit = limit ? parseInt(`${limit}`) : 25
  page = page ? parseInt(`${page}`) < 1 ? 1 : parseInt(`${page}`) : 1

  return {limit, page, pagination: paginate}
}

export const charge = async (method: string, payload: IChargePayload, cb: (err, result) => any) => {
  try {
    if(compareStrings(method, "wallet")){
      const wallet = await User.findById(payload.user)
      if(wallet.balance < payload.amount){
        throw new BadRequestException("Insufficient balance, please fund your wallet")
      }
      wallet.balance = numeral(wallet.balance).subtract(payload.amount).value()
      await wallet.save()

      const tx = await Transaction.create({
        wallet: wallet.id,
        status: "successful",
        amount: payload.amount,
        narration: payload.description,
        type: "charge"
      })

      cb(null, tx)
    }
    else if(compareStrings(method, "card")){
      const card = await Card.findById(payload.card)
      if(!card) throw new NotFoundException("card not found");

      const result = await chargeCard({
        amount: payload.amount, 
        payment_method: card.reference,
        metadata: payload.metadata
      })

      cb(null, result)
    }
    else if(compareStrings(method, "paypal")){
      createPayment(payload.amount, payload.description, payload.resources, async (err, result) => {
        if(err){
          throw new ServiceError(err.message, err.httpStatusCode, err.response.details)
        }
        else return cb(null, result)
      })
    }
    else throw new BadRequestException("Payment method not supported")
  } catch (error) {
    return cb(error, null)
  }
}  

export const geocoder = async (payload: string | number[]) => {
  try {
    const params = new URLSearchParams()
    params.append("key", GOOGLE_API_KEY)
    if(typeof payload === "string"){
      params.append("address", payload);
    }
    else params.append("latlng", payload.join(","));

    const { data } = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?" + params.toString())
    if(data?.status !== "OK") throw new BadRequestException(data?.error_message)
    const { formatted_address, geometry } = data.results[0]
    return {
      formatted_address,
      coordinates: [ geometry?.location?.lat, geometry?.location?.lng ]
    }
  } catch (error) {
    console.error(error)
    return null
  }
} 
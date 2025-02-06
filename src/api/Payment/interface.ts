import { EPaymentService } from "../../model/payment"
import { IInitializePaymentResult as ICardInitializePaymentResult } from "../../service/stripe/interface"

export interface IInitializePayment {
  amount: number
  service: EPaymentService
  method: string | "wallet" | "card" | "paypal"
  narration: string
  referrence: string
  callback_url: string
  capture?: boolean
}

export interface IInitializePaymentResult {
  id: string
  card?: ICardInitializePaymentResult
  paypal?: { link: string }
}
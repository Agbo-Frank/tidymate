import { model, PaginateModel, Schema } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IPayment {
  amount: number
  referrence: string //referrenc to the resource eg for order service the referrence is the order's id
  service: EPaymentService
  method: "wallet" | "card" | "paypal"
  provider: string
  status: string | "successful" | "pending" | "failed"
  fee: number
  user: string
  narration: string
  provider_referrence: string // this is the id from the provider
  metadata: any
}

export enum EPaymentService {
  order = "order",
  subscription = "subscription",
  walletFunding = "wallet-funding"
}

const payment = new Schema<IPayment>({
  amount: Number,
  referrence: String,
  service: String,
  method: String,
  status: {
    type: String,
    default: "pending"
  },
  fee: Number,
  user: String,
  narration: String,
  provider_referrence: String,
  provider: String,
  metadata: Schema.Types.Mixed
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

payment.plugin(mongoosePaginate);

const Payment = model<IPayment, PaginateModel<IPayment>>("payment", payment)
export default Payment
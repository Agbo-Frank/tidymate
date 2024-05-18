import { Schema, model } from "mongoose";

export const methods = {
  "wallet": "wallet",
  "card": "card",
  "paypal": "paypal"
}

export interface IWallet {
  user: string
  balance: number
  escrow: number
  currency: string
}

const wallet = new Schema<IWallet>({
  user: String,
  currency: String,
  balance: {
    type: Number,
    default: 0
  },
  escrow: {
    type: Number,
    default: 0
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Wallet = model<IWallet>("wallet", wallet)
export default Wallet
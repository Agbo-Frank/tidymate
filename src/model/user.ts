import { Schema, model, PaginateModel, Types } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

export const methods = {
  "wallet": "wallet",
  "card": "card",
  "paypal": "paypal"
}

export interface IUser {
  _id?: string
  first_name: string
  last_name: string
  gender: string
  email: string
  phone_number: string
  provider: string[]
  password: string
  avatar: string
  balance: number
  escrow: number
  currency: string
  roles: string
  email_verified: boolean
  referral_code: string
  created_at: string
  cleaner: string | typeof Types.ObjectId
} 

const user = new Schema<IUser>({
  avatar: {
    type: String,
    default: null
  },
  first_name: String,
  last_name: String,
  gender: {
    type: String,
    enum: ["male", "female"]
  },
  provider: [String],
  email: {
    type: String,
    lowercase: true,
    index: true,
    unique: true
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  currency: String,
  balance: { type: Number, default: 0 },
  escrow: { type: Number, default: 0 },
  phone_number: {
    type: String,
    trim: true
  },
  password: String,
  roles: String,
  cleaner: {
    type: Types.ObjectId,
    ref: "cleaner"
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

user.plugin(mongoosePaginate);
const User = model<IUser, PaginateModel<IUser>>("User", user)
export default User
import { Schema, Types, model } from "mongoose"

export interface IRequest {
  user: string | typeof Types.ObjectId
  balance: number
  amount: number
  status: string
  phone_number: string
  location: {
    address: string
    house_num: string
    city: string
    state: string
    postal_code: string
  }
}

const request = new Schema<IRequest>({
  user: {
    type: Types.ObjectId,
    ref: "User"
  },
  balance: {
    type: Number,
    default: 0
  },
  amount: {
    type: Number,
    default: 100
  },
  status: {
    type: String,
    default: "pending",
    enum: ["received", "approved", "completed", "pending"]
  },
  phone_number: String,
  location: {
    address: String,
    house_num: String,
    city: String,
    state: String,
    postal_code: String,
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Request = model("request", request)
export default Request
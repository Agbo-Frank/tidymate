import { Schema, model } from "mongoose"

export interface ISubscription {
  amount: number
  currency: string
  payment_method: string
  user: string
  status: string 
  due_at: string
  card: string
  metadata: any
}

const subscription = new Schema<ISubscription>({
  amount: Number,
  payment_method: String,
  currency: String,
  user: String,
  status: {
    type: String,
    default: "pending"
  }, 
  due_at: String,
  card: String,
  metadata: Schema.Types.Mixed
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Subscription = model("subscription", subscription)
export default Subscription
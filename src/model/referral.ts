import { Schema, Types, model } from "mongoose"

export interface IReferral {
  user: string | typeof Types.ObjectId
  referee: string | typeof Types.ObjectId
  reward: number
  currency: string
  completed: boolean
}

const referral = new Schema<IReferral>({
  user: {
    type: Types.ObjectId,
    ref: "User"
  },
  referee: {
    type: Types.ObjectId,
    ref: "User"
  },
  reward: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: "USD"
  },
  completed: {
    type: Boolean,
    default: false
  }
},{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}
)

const Referral = model<IReferral>("referral", referral)
export default Referral
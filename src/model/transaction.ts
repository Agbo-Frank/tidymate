import { PaginateModel, Schema, model } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

export interface ITransaction {
  amount: number
  status: string | "successful" | "pending" | "failed"
  type: string | "funding" | "charge" | "commission"
  fee: number
  user: string
  narration: string
  payment: string
  metadata: any
}

const transaction = new Schema<ITransaction>({
  amount: Number,
  status: {
    type: String,
    default: "pending"
  },
  fee: {
    type: Number,
    default: 0
  },
  type: String,
  user: String,
  narration: String,
  payment: {
    type: String,
    ref: "payment"
  },
  metadata: Schema.Types.Mixed
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

transaction.plugin(mongoosePaginate);

const Transaction = model<ITransaction, PaginateModel<ITransaction>>("transaction", transaction)
export default Transaction
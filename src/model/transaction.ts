import { PaginateModel, Schema, model } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

export interface ITransaction {
  amount: number
  status: string | "successful"
  type: string | "credit" | "debit"
  payment_method: string
  wallet: string
  narration: string
  metadata: any
}

const transaction = new Schema<ITransaction>({
  amount: Number,
  status: String,
  type: String,
  wallet: String,
  payment_method: String,
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
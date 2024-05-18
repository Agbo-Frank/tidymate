import { Schema, model } from "mongoose";

export interface ICleaner {
  user: string
  code: string
  earnings: number
  verified: boolean
}

const cleaner = new Schema<ICleaner>({
  user: String,
  code: String,
  earnings: Number,
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Cleaner = model<ICleaner>("cleaner", cleaner)
export default Cleaner
import { Schema, Types, model } from "mongoose";

export interface IReview {
  user: string | typeof Types.ObjectId
  cleaner: string | typeof Types.ObjectId
  order: string | typeof Types.ObjectId
  rate: number
  comment: string
}

const review = new Schema<IReview>({
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  cleaner: {
    type: Types.ObjectId,
    ref: "user"
  },
  order: {
    type: Types.ObjectId,
    ref: "order"
  },
  rate: {
    type: Number,
    default: 0
  },
  comment: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Review = model<IReview>("review", review)
export default Review
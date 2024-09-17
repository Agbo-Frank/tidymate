import { Schema, Types, model } from "mongoose";

export interface IReview {
  order: string | typeof Types.ObjectId
  rate: number
  comment: string
}

const review = new Schema<IReview>({
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
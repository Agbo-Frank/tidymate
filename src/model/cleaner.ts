import { Schema, Types, model } from "mongoose";
import numeral from "numeral";

export interface IDoc {
  type: "proof_of_work" | "profile" | "gov_id" | "back_check",
  url: string
  verified?: boolean
}

export interface ICleaner {
  user: string | typeof Types.ObjectId
  code: string
  earnings: number
  verified: boolean
  completed_order: number
  rating: {  num_of_rating: number; value_of_rating: number }
  avg_rating: number
  location: {
    type: string
    coordinates: Number []
  }
  docs: IDoc[]
}

const cleaner = new Schema<ICleaner>({
  user: {
    type: Types.ObjectId,
    ref: "User"
  },
  code: String,
  earnings: { type: Number, default: 0 },
  completed_order: { type: Number, default: 0 },
  rating: {
    num_of_rating: { type: Number, default: 0 },
    value_of_rating: { type: Number, default: 0 }
  },
  location: {
    type: {type: String, default: "Point"},
    coordinates: [ Number ]
  },
  docs: [{
    type: {
      type: String,
      enum: ["proof_of_work", "profile", "gov_id", "back_check"]
    },
    url: String,
    verified: { type: Boolean, default: false }
  }],
  verified: { type: Boolean, default: false }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  virtuals: {
    avg_rating: {
      get() {
        return numeral(this.rating.value_of_rating).divide(this.rating.num_of_rating).value() || 0
      }
    }
  },
  toJSON: { virtuals: true }
})

cleaner.index({ location: '2dsphere' });

const Cleaner = model<ICleaner>("cleaner", cleaner)
export default Cleaner
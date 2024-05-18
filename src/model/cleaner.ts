import { Schema, Types, model } from "mongoose";

export interface ICleaner {
  user: string | typeof Types.ObjectId
  code: string
  earnings: number
  verified: boolean
  location: {
    type: string
    coordinates: Number []
  }
}

const cleaner = new Schema<ICleaner>({
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  code: String,
  earnings: Number,
  location: {
    type: {type: String, default: "Point"},
    coordinates: [ Number ]
  },
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

cleaner.index({ location: '2dsphere' });

const Cleaner = model<ICleaner>("cleaner", cleaner)
export default Cleaner
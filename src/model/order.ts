import { PaginateModel, Schema, Types, model } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

interface IOrderCleaner {
  user: string | typeof Types.ObjectId
  name: string
  avatar: string
  leader: boolean
}

export interface IOrder {
  user: string | typeof Types.ObjectId
  service: string
  note: string
  config: {
    bedroom: number
    livingroom: number
    bathroom: number
    store: number
    balcony: number
  }
  num_cleaners: number
  images: string[]
  scheduled_at: string
  started_at: string
  ended_at: string
  estimated_duration: number
  actual_duration: number
  amount: number
  tip: number
  currency: string
  paid: string // pending initialized completed declined
  status: string // pending cancelled ongoing ended completed
  cleaners: IOrderCleaner[]
  payment: string
  metadata: any
  socket: string
  location: {
    address: string,
    type: string,
    coordinates: number[] //[lat, lon]
  }
}

const orderCleaner = new Schema<IOrderCleaner>({
  user: {
    type: String,
    ref: "User"
  },
  name: String,
  avatar: String,
  leader: {
    type: Boolean,
    default: false
  }
})

const order = new Schema<IOrder>({
  service: String,
  note: String,
  user: {
    type: Types.ObjectId,
    ref: "User"
  },
  config: {
    bedroom: { type: Number, default: 0 },
    livingroom: { type: Number, default: 0 },
    bathroom: { type: Number, default: 0 },
    store: { type: Number, default: 0 },
    balcony: { type: Number, default: 0 }
  },
  num_cleaners: { type: Number, default: 1 },
  estimated_duration: Number,
  actual_duration: Number,
  images: [String],
  scheduled_at: Date,
  started_at: Date,
  ended_at: Date,
  amount: { type: Number },
  tip: { type: Number, default: 0 },
  currency: String,
  paid: {
    type: String,
    default: "pending",
    enum: ["pending", "initialized", "completed"]
  },
  payment: {
    type: String,
    ref: "payment"
  },
  status: {
    type: String,
    default: "pending"
  },
  cleaners: [orderCleaner],
  socket: String,
  location: {
    address: String,
    type: { type: String, default: "Point" },
    coordinates: [Number]
  },
  metadata: Schema.Types.Mixed
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

order.plugin(mongoosePaginate);

const Order = model<IOrder, PaginateModel<IOrder>>("order", order)
export default Order
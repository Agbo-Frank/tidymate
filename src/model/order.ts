import { PaginateModel, Schema, Types, model } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

interface IOrderCleaner {
  user: string | typeof Types.ObjectId
  accepted: boolean
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
  start_date: string
  amount: number
  currency: string
  paid: boolean
  status: string // pending 
  cleaners: IOrderCleaner[]
  metadata: any
  location: {
    address: string,
    coordinates: number[]
  }
}

const orderCleaner = new Schema<IOrderCleaner>({
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  accepted: {
    type: Boolean,
    default: false
  },
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
    ref: "user"
  },
  config: {
    bedroom: {type: Number, default: 0},
    livingroom: {type: Number, default: 0},
    bathroom: {type: Number, default: 0},
    store: {type: Number, default: 0},
    balcony: {type: Number, default: 0}
  },
  num_cleaners: Number,
  images: [ String ],
  start_date: String,
  amount: { type: Number },
  currency: String,
  paid: {type: Boolean, default: false},
  status: String, // pending
  cleaners: [ orderCleaner ],
  location: {
    address: String,
    coordinates: [ Number ]
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
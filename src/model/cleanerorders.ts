import { PaginateModel, Schema, Types, model } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

interface ICleanerOrder {
  cleaner: string | typeof Types.ObjectId
  order: string | typeof Types.ObjectId
  accepted: boolean

  leader: boolean
  metadata: any
}

const cleanerOrder = new Schema<ICleanerOrder>({
  order: {
    type: Types.ObjectId,
    ref: "order"
  },
  cleaner: {
    type: Types.ObjectId,
    ref: "cleaner"
  },
  accepted: {type: Boolean, default: false},
  leader: {type: Boolean, default: false},
  metadata: Schema.Types.Mixed
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

cleanerOrder.plugin(mongoosePaginate);

// const CleanerOrder = model<ICleanerOrder, PaginateModel<ICleanerOrder>>("cleanerorder", cleanerOrder)
// export default CleanerOrder
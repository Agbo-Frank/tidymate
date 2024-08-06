import { model, PaginateModel, Schema } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

export interface INotification {
  title: string
  body: string
  created_at?: string
  users: string[]
  views: string[] //users ids that have viewed the notifications
  metadata: any
}

const notification = new Schema<INotification>({
  title: String,
  body: String,
  users: [ String ],
  views: [ String ],
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

notification.plugin(mongoosePaginate);
const Notification = model<INotification, PaginateModel<INotification>>("notification", notification)
export default Notification
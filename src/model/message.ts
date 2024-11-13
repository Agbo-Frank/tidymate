import { model, Schema } from "mongoose"

export interface IMessage {
  order: string
  from: string
  content: string
}

const message = new Schema({
  order: String,
  from: String,
  content: String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Message = model<IMessage>("message", message)
export default Message
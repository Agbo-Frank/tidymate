import { model, Schema } from "mongoose"

export interface IMessage {
  order: string
  from: string
  content: string
}

const message = new Schema({
  order: String,
  from: { type: String, ref: "User" },
  content: String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Message = model<IMessage>("message", message)
export default Message
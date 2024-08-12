import { model, Schema } from "mongoose"


export interface IHistory {
  name: string
  address: string
  type: string
  user: string
  coordinates: number[]
} 

const history = new Schema<IHistory>({
  name: String,
  address: String,
  user: String,
  type: String,
  coordinates: [ Number ],
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const History = model<IHistory>("history", history)
export default History
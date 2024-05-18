import { Schema, model } from "mongoose"

export interface ICard {
  user: string
  last4: string
  brand: string
  name: string
  reference: string
  provider: string
}

const card = new Schema<ICard>({
  user: String,
  last4: String,
  brand: String,
  name: String,
  reference: String,
  provider: {
    type: String,
    default: "stripe"
  }
})

const Card = model("card", card)
export default Card
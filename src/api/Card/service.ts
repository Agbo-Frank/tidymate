import Card from "../../model/cards";
import User from "../../model/user";
import { createCard } from "../../service/stripe";
import { BadRequestException, NotFoundException } from "../../utility/service-error";
import { ICard } from "./interface";

class Service {
  async create(payload: ICard, user_id: string){
    const { number, name, cvc, exp_month, exp_year } = payload
    const user = await User.findById(user_id)
    if(!user) throw new NotFoundException("User not found");
  
    const result = {
      "id": "pm_1MqLiJLkdIwHu7ixUEgbFdYF",
      "card": {
        "brand": "visa",
        "exp_month": 8,
        "exp_year": 2026,
        "fingerprint": "mToisGZ01V71BCos",
        "funding": "credit",
        "last4": "4242",
      },
    } //await createCard({number, cvc, exp_month, exp_year })
    if(!result) throw new BadRequestException("Unable to add card, please try again");
   
    const data = await Card.create({
      brand: result.card.brand,
      last4: result.card.last4,
      name, user: user_id,
      reference: result.id
    })

    return {message: "Card saved successfully", data}
  }

  async list(user: string){
    const data = await Card.find({user})
    return {message: "Saved cards retrieved successfully", data}
  }

  async del(_id: string, user: string){
    const card = await Card.findOne({user, _id})
    if(!card) throw new BadRequestException("Card not found");

    await card.deleteOne()
    return {message: "unsave card successfully", data: null}
  }
}

export default new Service()
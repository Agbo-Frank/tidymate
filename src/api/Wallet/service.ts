import Card from "../../model/cards";
import { Response} from "express"
import Transaction from "../../model/transaction";
import { capturePayment, createPayment } from "../../service/paypalv2";
import { chargeCard } from "../../service/stripe/charge-card";
import { compareStrings } from "../../utility/helpers";
import { IPagination } from "../../utility/interface";
import { BadRequestException, NotFoundException, ServiceError } from "../../utility/service-error";
import { IDeposit } from "./interface";;
import User from "../../model/user";

class Service {

  //@ts-ignore
  async deposit(payload: IDeposit, user_id: string){
    const { amount, method } = payload

    const user = await User.findById(user_id)
    if(!user) throw new NotFoundException("User not found");
    let data = null
    const tx = new Transaction({
      amount, type: "funding",
      user: user.id,
      payment_method: method
    })

    if(compareStrings(method, "card")){
      const card = await Card.findById(payload.card)
      if(!card) throw new NotFoundException("card not found");

      const result = await chargeCard({
        amount, 
        payment_method: card.reference,
        metadata: { tx: tx.id }
      })
      tx.payment_ref = result?.id
      //TODO: handle the webhook
    } else if(compareStrings(method, "paypal")){
      const result = await createPayment({
        amount, reference: `WAL-${tx.id.slice(-8)}`,
        description: "Tidymate Wallet Funding",
        intent: "CAPTURE",
        callback_url: payload?.callback_url
      })
      
      const link = result.links.find(l => compareStrings(l.rel, "payer-action"))
      tx.payment_ref = result?.id
      data = link ? { link: link?.href } : null;
    } else {
      throw new BadRequestException("Payment method not supported")
    }

    await tx.save()
    return { message: "Deposit initiated successfully", data }
  }

  withdraw(){}

  async transactions(user: string, {limit, page}: IPagination){
    const data = await Transaction.paginate(
      { user }, 
      { page, limit , sort: { updated_at: "desc" }}
    )

    return { message: "Transaction retrieve successfully", data }
  }
}

export default new Service()
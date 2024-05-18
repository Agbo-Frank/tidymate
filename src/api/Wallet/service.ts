import Card from "../../model/cards";
import Transaction from "../../model/transaction";
import Wallet from "../../model/wallet";
import { chargeCard } from "../../service/stripe/charge-card";
import { compareStrings } from "../../utility/helpers";
import { IPagination } from "../../utility/interface";
import { NotFoundException } from "../../utility/service-error";
import { IDeposit } from "./interface";

class Service {

  async deposit(payload: IDeposit, user: string){
    const { amount, method } = payload

    const wallet = await Wallet.findOne({ user })
    if(!wallet) throw new NotFoundException("User not found");

    const tx = new Transaction({
      amount, type: "credit",
      wallet: wallet?.id,
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

      tx.metadata = { payment: result.id }
      //TODO: handle the webhook
    }

    await tx.save()
  }

  async transactions(user: string, pagination: IPagination){
    const wallet = await Wallet.findOne({ user })
    if(!wallet) throw new NotFoundException("Wallet not found")
    const data = await Transaction.paginate(
      { wallet: wallet.id }, 
      {...pagination, sort: { updated_at: "desc" }}
    )

    return { message: "Transaction retrieve successfully", data }
  }
}

export default new Service()
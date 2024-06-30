import Card from "../../model/cards";
import { Response} from "express"
import Transaction from "../../model/transaction";
import Wallet from "../../model/wallet";
import { createPayment } from "../../service/paypal";
import { chargeCard } from "../../service/stripe/charge-card";
import { compareStrings, responsHandler } from "../../utility/helpers";
import { IPagination } from "../../utility/interface";
import { BadRequestException, NotFoundException, ServiceError } from "../../utility/service-error";
import { IDeposit } from "./interface";
import { StatusCodes } from "http-status-codes";

class Service {

  //@ts-ignore
  async deposit(res: Response, payload: IDeposit, user: string){
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
      await tx.save()

      return responsHandler(res, "Deposit initiated successfully", StatusCodes.CREATED, tx.metadata)
      //TODO: handle the webhook
    }
    else if(compareStrings(method, "paypal")){
      createPayment(amount, "Tidymate Wallet Funding", "wallet", async (err, result) => {
        if(err){
          throw new ServiceError(err.message, err.httpStatusCode, err.response.details)
        }
        else {
          tx.metadata = { payment: result?.id }
          await tx.save()

          return responsHandler(
            res, 
            "Deposit initiated successfully", 
            StatusCodes.CREATED, 
            { link: result.link, id: result.id }
          )
        }
      })
    }
    else {
      throw new BadRequestException("Payment method not supported")
    }
  }

  withdraw(){}

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
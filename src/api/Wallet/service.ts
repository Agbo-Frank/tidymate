import Transaction from "../../model/transaction";
import { IPagination } from "../../utility/interface";
import { IDeposit } from "./interface";
import paymentService from "../Payment/service"
import { EPaymentService } from "../../model/payment";

class Service {

  //@ts-ignore
  async deposit(payload: IDeposit, user_id: string) {
    const { amount, method } = payload

    const tx = await Transaction.create({
      amount,
      type: "funding",
      narration: "Tidymate Wallet Funding",
      user: user_id,
    })

    const data = await paymentService.initialize({
      referrence: tx.id,
      service: EPaymentService.walletFunding,
      method,
      amount,
      narration: tx.narration,
      intent: "CAPTURE",
      callback_url: payload?.callback_url
    }, user_id)

    tx.payment = data.data.id
    await tx.save()

    return { message: "Deposit initiated successfully", data: data.data }
  }

  withdraw() { }

  async transactions(user: string, { limit, page }: IPagination) {
    const data = await Transaction.paginate(
      { user },
      { page, limit, sort: { updated_at: "desc" } }
    )

    return { message: "Transaction retrieve successfully", data }
  }
}

export default new Service()
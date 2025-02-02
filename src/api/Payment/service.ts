import Payment from "../../model/payment";
import Transaction from "../../model/transaction";
import User from "../../model/user";
import { createPayment } from "../../service/paypalv2";
import { initializePayment } from "../../service/stripe";
import { compareStrings, isEmpty } from "../../utility/helpers";
import { BadRequestException, NotFoundException } from "../../utility/service-error";
import { IInitializePayment, IInitializePaymentResult } from "./interface";
import numeral from "numeral"

class Service {
  async initialize(payload: IInitializePayment, user_id: string) {
    const { amount, narration, intent, referrence, callback_url, service } = payload
    const payment = new Payment({
      amount,
      service,
      referrence,
      user: user_id,
      narration
    })
    const user = await User.findById(user_id)
    if (!user) throw new NotFoundException("User not found")

    let data: IInitializePaymentResult = {
      id: payment.id
    }

    if (compareStrings(payload.method, "wallet")) {
      if (user.balance < payment.amount) {
        throw new BadRequestException("Insufficient balance, please fund your wallet")
      }
      user.balance = numeral(user.balance).subtract(payment.amount).value()
      user.escrow = numeral(user.escrow).add(payment.amount).value()

      await user.save()

      const tx = new Transaction({
        user: user_id,
        status: "pending",
        narration,
        amount: payment.amount,
        type: "charge",
        payment: payment.id
      })

      payment.provider_referrence = tx?.id
      payment.method = "wallet"
      payment.provider = "tidymate"

      await payment.save()
      await tx.save()
    }

    else if (compareStrings(payload.method, "card")) {
      const user = await User.findById(user_id)
      if (!user) throw new NotFoundException("User not found");

      const result = await initializePayment({
        name: user?.full_name,
        email: user?.email,
        amount: payment.amount,
        customer_id: user?.stripe_customer || null,
        description: narration
      })
      if (result) {
        data.card = result;

        if (isEmpty(user.stripe_customer) && !isEmpty(result.customer_id)) {
          await User.updateOne(
            { _id: user_id },
            { stripe_customer: result.customer_id }
          )
        }

        payment.provider_referrence = result?.id
        payment.method = "card"
        payment.provider = "stripe"

        await payment.save()
      };
      //TODO: handle the webhook
    }

    else if (compareStrings(payload.method, "paypal")) {
      const result = await createPayment({
        amount: payment.amount,
        reference: payment.id, // `ORD-${order.id.slice(-8)}`,
        description: narration,
        intent,
        callback_url
      })

      const link = result.links.find(l => compareStrings(l.rel, "payer-action"))
      data.paypal = link ? { link: link?.href } : null;

      payment.provider_referrence = result?.id
      payment.method = "paypal"
      payment.provider = "paypal"

      await payment.save()
    } else {
      throw new BadRequestException("Payment method not supported")
    }

    return { message: "Payment initaited successfully", data }
  }
}

export default new Service()
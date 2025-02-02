import { Response, Request } from "express"
import Transaction from "../../model/transaction"
import { BadRequestException, NotFoundException } from "../../utility/service-error"
import Order from "../../model/order"
import { compareStrings, isEmpty } from "../../utility/helpers"
import numeral from "numeral"
import User from "../../model/user"
import { capturePayment } from "../../service/paypalv2"
import Payment, { EPaymentService } from "../../model/payment"

const events = [
  "CHECKOUT.ORDER.APPROVED",
  "PAYMENT.CAPTURE.COMPLETED",
  "CHECKOUT.PAYMENT-APPROVAL.REVERSED"
]

class Controller {
  async paypal(req: any, res: Response) {
    try {
      const { event_type, resource } = req.body
      if (isEmpty(event_type) || !events.includes(event_type)) return res.status(200);

      let order_id = null
      if (compareStrings(resource?.status, "APPROVED")) {
        order_id = resource?.id
      }
      if (compareStrings(resource?.status, "COMPLETED")) {
        order_id = resource?.supplementary_data?.related_ids?.order_id
      }

      const payment = await Payment.findOne({
        provider_referrence: order_id,
        provider: "paypal"
      })
      if (!payment) throw new NotFoundException("Payment not found");
      if (payment.status !== "pending") throw new BadRequestException(`Payment ${payment.status}`)

      if (payment.service === EPaymentService.walletFunding) {
        const tx = await Transaction.findOne({ _id: payment.referrence })

        if (!tx || tx?.status !== "pending") {
          throw new BadRequestException("Bad request")
        }
        if (
          compareStrings(resource?.status, "APPROVED") &&
          compareStrings(resource?.intent, "CAPTURE")
        ) {
          console.log("Capturing payment...")
          await capturePayment(resource?.id)
        }
        if (compareStrings(resource?.status, "COMPLETED")) {
          console.log("Completing payment...")
          const amount = resource?.seller_receivable_breakdown?.net_amount?.value;
          const fee = resource?.seller_receivable_breakdown?.paypal_fee?.value;

          tx.status = "successful"
          tx.fee = numeral(fee).value();
          payment.status = "successful"

          await User.updateOne(
            { _id: tx.user },
            { $inc: { balance: numeral(amount).value() } }
          )

          await tx.save()
          await payment.save()
        }
      }
      if (payment.service === EPaymentService.order) {
        const order = await Order.findOne({ _id: payment.referrence })
        if (!order) throw new NotFoundException("Order not found");

        if (compareStrings(resource?.status, "APPROVED")) order.paid = "initialized"
        else if (compareStrings(resource?.status, "COMPLETED")) order.paid = "completed";
        else order.paid = "pending"

        await order.save()
      }
      return res.status(200)
    } catch (error) {
      console.log(error)
      return res.status(200)
    }
  }

  async stripe(req: Request, res: Response) {
    console.log(req.body)
    return res.status(200)
  }
}

export default new Controller()
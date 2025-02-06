import { Response, Request } from "express"
import Transaction from "../../model/transaction"
import { BadRequestException, NotFoundException } from "../../utility/service-error"
import Order from "../../model/order"
import { compareStrings, isEmpty } from "../../utility/helpers"
import numeral from "numeral"
import User from "../../model/user"
import { capturePayment } from "../../service/paypalv2"
import Payment, { EPaymentService } from "../../model/payment"

const PAYPAL_EVENTS = [
  "CHECKOUT.ORDER.APPROVED",
  "PAYMENT.CAPTURE.COMPLETED",
  "CHECKOUT.PAYMENT-APPROVAL.REVERSED"
]

const STRIPE_EVENTS = [
  "payment_intent.succeeded",
  "payment_intent.processing",
  "payment_intent.payment_failed"
]

class Controller {
  async paypal(req: any, res: Response) {
    try {
      const { event_type, resource } = req.body
      if (isEmpty(event_type) || !PAYPAL_EVENTS.includes(event_type)) return res.status(200);

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
          await capturePayment(resource?.id)
        }
        if (compareStrings(resource?.status, "COMPLETED")) {
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
    try {
      const { type, data } = req.body
      if (isEmpty(type) || isEmpty(data?.object) || !STRIPE_EVENTS.includes(type)) {
        throw new BadRequestException("Invalid request")
      }
      const [event, status] = type.split(".")

      const payment = await Payment.findOne({
        provider_referrence: data?.object?.id,
        provider: "stripe"
      })
      if (!payment) {
        throw new NotFoundException("Payment not found");
      }
      if (payment.status !== "pending") {
        throw new BadRequestException(`Payment ${payment.status}`);
      }

      const is_successful = compareStrings(data?.object?.status, "succeeded") && compareStrings(status, "succeeded")
      const failed = compareStrings(status, "payment_failed")

      if (payment.service === EPaymentService.walletFunding) {
        const tx = await Transaction.findOne({ _id: payment.referrence })
        if (!tx || tx?.status !== "pending") {
          throw new BadRequestException("Bad request")
        }

        if (is_successful) {
          tx.status = "successful"
          payment.status = "successful"

          await User.updateOne(
            { _id: tx.user },
            { $inc: { balance: numeral(data?.object?.amount_received).divide(100).value() } }
          )
        }
        if (failed) {
          tx.status = "failed"
          payment.status = "failed"
        }

        await tx.save()
      }
      if (payment.service === EPaymentService.order) {
        const order = await Order.findOne({ _id: payment.referrence })
        if (!order) throw new NotFoundException("Order not found");

        if (is_successful) {
          order.paid = "completed";
          payment.status = "successful"
        }
        if (failed) {
          order.paid = "declined"
          payment.status = "failed"
        }

        await order.save()
      }

      await payment.save()
      return res.status(200).json({ message: "Successful" })
    } catch (error) {
      return res.status(200).json({ message: error.message })
    }
  }
}

export default new Controller()
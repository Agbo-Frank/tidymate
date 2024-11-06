import { Response } from "express"
import Transaction from "../../model/transaction"
import { BadRequestException, NotFoundException } from "../../utility/service-error"
import Order from "../../model/order"
import { compareStrings, isEmpty } from "../../utility/helpers"
import numeral from "numeral"
import User from "../../model/user"
import { capturePayment } from "../../service/paypalv2"

const events = [
  "CHECKOUT.ORDER.APPROVED",
  "PAYMENT.CAPTURE.COMPLETED",
  "CHECKOUT.PAYMENT-APPROVAL.REVERSED"
]

class Controller {
  async paypal(req: any, res: Response){
    try {
      const { event_type, resource } = req.body

      if(isEmpty(event_type) || !events.includes(event_type)) return res.status(200);

      let custom_id = null
      let order_id = null

      if(compareStrings(resource?.status, "APPROVED")){
        const unit = resource?.purchase_units.find(u => compareStrings(u?.reference_id, "default"))
        custom_id = unit.custom_id
        order_id = resource?.id
      }

      if(compareStrings(resource?.status, "COMPLETED")){
        custom_id = resource?.custom_id
        order_id = resource?.supplementary_data?.related_ids?.order_id
      }

      if(custom_id.startsWith("WAL-")){
        const tx = await Transaction.findOne({ payment_ref: order_id })
        if(!tx || tx?.status !== "pending"){
          throw new BadRequestException("Bad request")
        }
        if(
          compareStrings(resource?.status, "APPROVED") && 
          compareStrings(resource?.intent, "CAPTURE")
        ){
          await capturePayment(resource?.id)
        }
        if(compareStrings(resource?.status, "COMPLETED")){
          const amount = resource?.seller_receivable_breakdown?.net_amount?.value;
          const fee = resource?.seller_receivable_breakdown?.paypal_fee?.value;

          tx.status = "successful"
          tx.fee = numeral(fee).value();

          await User.updateOne(
            { _id: tx.user }, 
            { $inc: { balance: numeral(amount).value() }
          })

          await tx.save()
        }
      }
      if(custom_id.startsWith("ORD-")){
        const order = await Order.findOne({ payment_ref: order_id })
        if(!order) throw new NotFoundException("Order not found");

        if(compareStrings(resource?.status, "APPROVED")) order.paid = "initialized"
        else if(compareStrings(resource?.status, "COMPLETED")) order.paid = "completed";
        else order.paid = "pending"

        await order.save()
      }
      return res.status(200)
    } catch (error) {
      console.log(error)
      return res.status(200)
    }
  }
}

export default new Controller()
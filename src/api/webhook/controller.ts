import { NextFunction, Response } from "express"
import Transaction from "../../model/transaction"
import { BadRequestException, NotFoundException, ServiceError } from "../../utility/service-error"
import Order from "../../model/order"
import { compareStrings, isEmpty, responsHandler } from "../../utility/helpers"
import numeral from "numeral"
import { StatusCodes } from "http-status-codes"
import Subscription from "../../model/subscription"
import { executePayment, executeSubscription } from "../../service/paypal"
import User from "../../model/user"

class Controller {
  private events = [
    "CHECKOUT.ORDER.APPROVED",
    "CHECKOUT.ORDER.COMPLETED",
    "CHECKOUT.PAYMENT-APPROVAL.REVERSED"
  ]

  async paypal(req: any, res: Response, next: NextFunction){
    try {
      const { event_type, resource } = req.body
      if(isEmpty(event_type) || !this.events.includes(event_type)) res.status(200);

      const unit = resource.purchase_units.find(u => compareStrings(u?.reference_id, "default"))

      if(unit.custom_id.startsWith("WAL-")){
        const tx = await Transaction.findOne({ payment_ref: resource?.id })
        if(!tx || tx?.status !== "pending"){
          throw new BadRequestException("Bad request")
        }
        if(compareStrings(resource?.status, "COMPLETED")){
          tx.status = "successful"
          await User.updateOne({ _id: tx.user }, { $inc: { balance: numeral(unit?.amount?.value).value() }})

          await tx.save()
        }
      }
      if(unit.custom_id.startsWith("ORD-")){
        const order = await Order.findOne({ payment_ref: resource?.id })
        if(!order) throw new NotFoundException("Order not found");

        if(compareStrings(resource?.status, "APPROVED")) order.paid = "initialized"
        else if(compareStrings(resource?.status, "COMPLETED")) order.paid = "completed";
        else order.paid = "pending"

        await order.save()
      }
      return res.status(200)
    } catch (error) {
      return res.status(200)
    }
  }
}

export default new Controller()
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

  async paypal(req: any, res: Response, next: NextFunction){
    try {
      const { resource } = req.body
      const unit = resource.purchase_units.find(u => compareStrings(u?.reference_id, "default"))

      if(unit.custom_id.startsWith("WAL-")){
        const tx = await Transaction.findOne({ payment_ref: resource?.id })
        if(!tx || tx?.status !== "pending"){
          throw new BadRequestException("Bad request")
        }
        if(compareStrings(resource?.status, "APPROVED")){
          tx.status = "successful"
          await User.updateOne({ _id: tx.user }, { $inc: { balance: numeral(unit?.amount?.value).value() }})

          await tx.save()
        }
      }
      if(unit.custom_id.startsWith("ORD-")){
        const order = await Order.findOne({ payment_ref: resource?.id })
        if(!order) throw new NotFoundException("Order not found");

        if(compareStrings(resource?.status, "APPROVED")){
          order.paid = true
          await order.save()
        }
      }
      return res.status(200)
    } catch (error) {
      return res.status(200)
    }
    
    // return console.log(JSON.stringify(req.body, null, 2))
    // const { status, resources } = req.params
    // let tx: any = null
    // let order: any = null
    // let sub: any = null
    // let amount = 0
    
    // const filter = {
    //   "metadata": { payment: req.query?.paymentId },
    //   // payment_method: "paypal"
    // }
    // console.log(filter)

    // if(compareStrings(resources, "wallet")){
    //   tx = await Transaction.findOne(filter)
    //   if(!tx) throw new NotFoundException("Transaction not found");
    //   amount = tx.amount;
    // }
    // else if(compareStrings(resources, "order")){
    //   order = await Order.findOne(filter)
    //   if(!order) throw new NotFoundException("Order not found");
    //   amount = order.amount;
    // }
    // else if(compareStrings(resources, "subscription")){
    //   sub = await Subscription.findOne(filter)
    //   if(!sub) throw new NotFoundException("Subcription not found");
    //   amount = sub.amount;
    // }
    // else {
    //   throw new NotFoundException("Resource not found/supported")
    // }

    // if(compareStrings(status, "failed")){
    //   //TODO: handled failed payment
    //   return;
    // }

    // if(compareStrings(resources, "subscription")){
    //   console.log("Query: ",req.query)
    //   return executeSubscription(req.query?.token, async (err, result) => {
    //     if(err) throw new ServiceError(err.message, err.httpStatusCode, err.response.details);
    //     console.log("Result: ", result)
        
    //     if(!compareStrings(result.state, "Active") || isEmpty(sub)) {
    //       throw new ServiceError(
    //         result?.failure_reason || "Payment not approved", 
    //         result.httpStatusCode, 
    //       );
    //     }

    //     sub.status = "active"
    //     await sub.save()
    //     return responsHandler(res, "Subscripton payment completed", StatusCodes.OK, result)
    //     //TODO: check for failed subscription
    //   })
    // }
    
    // return executePayment(
    //   amount, 
    //   req.query?.PayerID, 
    //   req.query.paymentId,
    //   async (err, result) => {
    //     if(err) throw new ServiceError(err.message, err.httpStatusCode, err.response.details);
    //     else {
    //       JSON.stringify(result, null, 2)
    //       if(result.state !== "approved") {
    //         throw new ServiceError(
    //           result?.failure_reason || "Payment not approved", 
    //           result.httpStatusCode, 
    //         );
    //       }
        
    //       if(!isEmpty(tx)){
    //         tx.status = "successful"
    //         const user = await User.findById(tx.user)
    //         if(!user) throw new NotFoundException("User not found")
    //         user.balance = numeral(user.balance).add(tx.amount).value()

    //         await user.save()
    //         await tx.save()
    //         return responsHandler(res, "Payment completed", StatusCodes.OK, result)
    //       }
    //       else if(!isEmpty(order)){
    //         order.paid = true
    //         await order.save()

    //         return responsHandler(res, "Payment completed", StatusCodes.OK, result)
    //       }
    //     }
    //   }
    // )
    
  }
}

export default new Controller()
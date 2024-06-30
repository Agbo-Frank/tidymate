import { NextFunction, Response } from "express"
import { executePayment } from "../../service/paypal"
import Transaction, { ITransaction } from "../../model/transaction"
import { BadRequestException, NotFoundException, ServiceError } from "../../utility/service-error"
import Order, { IOrder } from "../../model/order"
import { compareStrings, isEmpty, responsHandler } from "../../utility/helpers"
import Wallet from "../../model/wallet"
import numeral from "numeral"
import { Document } from "mongoose"
import { StatusCodes } from "http-status-codes"
import Subscription from "../../model/subscription"

class Controller {

  async paypal(req: any, res: Response, next: NextFunction){
    const { status, resources } = req.params
    let tx: any = null
    let order: any = null
    let sub: any = null
    
    const filter = {
      "metadata.payment": req.query?.paymentId,
      payment_method: "paypal"
    }

    if(compareStrings(resources, "wallet")){
      tx = await Transaction.findOne(filter)
      if(!tx) throw new NotFoundException("Transaction not found")
    }
    else if(compareStrings(resources, "order")){
      order = await Order.findOne(filter)
      if(!tx) throw new NotFoundException("Order not found")
    }
    else if(compareStrings(resources, "subscription")){
      sub = await Subscription.findOne(filter)
      if(!sub) throw new NotFoundException("Subcription not found")
    }
    else {
      throw new NotFoundException("Resource not found/supported")
    }

    if(compareStrings(status, "failed")){
      //TODO: handled failed payment
      return;
    }
    
    return executePayment(
      tx.amount, 
      req.query?.PayerID, 
      req.query.paymentId,
      async (err, result) => {
        if(err) throw new ServiceError(err.message, err.httpStatusCode, err.response.details);
        else {
          JSON.stringify(result, null, 2)
          if(result.state !== "approved") {
            throw new ServiceError(
              result?.failure_reason || "Payment not approved", 
              result.httpStatusCode, 
            );
          }
        
          if(!isEmpty(tx)){
            tx.status = "successful"
            const wallet = await Wallet.findById(tx.wallet)
            if(!wallet) throw new NotFoundException("Wallet not found")
            wallet.balance = numeral(wallet.balance).add(tx.amount).value()

            await wallet.save()
            await tx.save()
            return responsHandler(res, "Payment completed", StatusCodes.OK, result)
          }
          else if(!isEmpty(order)){
            order.paid = true
            await order.save()

            return responsHandler(res, "Payment completed", StatusCodes.OK, result)
          }
        }
      }
    )
    
  }
}

export default new Controller()
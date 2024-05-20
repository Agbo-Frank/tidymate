import dayjs from "dayjs";
import Order from "../../model/order";
import { IAddCleaner, ICreateOrder, IProcessPayment, IReOrder } from "./interface";
import { BadRequestException, NotFoundException } from "../../utility/service-error";
import { compareStrings, isEmpty } from "../../utility/helpers";
import Wallet from "../../model/wallet";
import Card from "../../model/cards";
import numeral from "numeral"
import { chargeCard } from "../../service/stripe/charge-card";
import User from "../../model/user";
import Transaction from "../../model/transaction";

class Service {
  async create(payload: ICreateOrder, user: string){
    const { service, note, start_date, location, config } = payload
    const order = new Order({
      service, note, 
      user,
      location, config,
      start_date: dayjs.unix(start_date).toISOString()
    })

    await order.save()

    return {message: "Order created successfully", data: order}
  }

  async reorder(payload: IReOrder, user: string){
    const order = await Order.findById(payload.order).lean()
    if(!order) throw new NotFoundException("Order not found ");

    const newOrder = new Order({
      ...order,
      paid: false,
      start_date: dayjs.unix(payload.start_date).toISOString()
    })

    await newOrder.save()

    return {
      message: "Order placed successfully",
      data: newOrder
    }
  }

  async addCleaners(payload: IAddCleaner, user: string) {
    const order = await Order.findOne({ user, _id: payload.order })
    if(!order){
      throw new NotFoundException("Order not found")
    } 

    const users = (await Promise.all(payload.cleaners.map(c => User.findById(c)))).filter(c => !isEmpty(c))
    const order_cleaners = users.map(u => ({user: u.id}))

    await order.updateOne({ $addToSet: { cleaners: { $each: order_cleaners } } })

    return { message: "Cleaners added successfully", data: order}
  }

  async processPayment(payload: IProcessPayment, user: string){
    const order = await Order.findById(payload.order_id)
    if(!order) throw new NotFoundException("Order not found");

    if(compareStrings(payload.method, "wallet")){
      const wallet = await Wallet.findOne({ user })
      if(wallet.balance < order.amount){
        throw new BadRequestException("Insufficient balance, please fund your wallet")
      }
      wallet.balance = numeral(wallet.balance).subtract(order.amount).value()
      await wallet.save()
      
      order.paid = true

      await Transaction.create({
        wallet: wallet.id,
        status: "successful",
        amount: order.amount,
        type: "debit"
      })
    }

    if(compareStrings(payload.method, "card")){
      const card = await Card.findById(payload.card)
      if(!card) throw new NotFoundException("card not found");
      
      const result = await chargeCard({
        amount: order.amount, 
        payment_method: card.reference,
        metadata: { order: order.id }
      })
      order.metadata = {payment: result.id}
      //TODO: handle the webhook
    }

    await order.save()
  }

  async getOrders(user: string){
    const data = await Order.paginate({ user })
    return {message: "Orders retreved successfully", data}
  }

  async getOrder(id: string, user: string){
    let data = await Order.findById(id)
    if(!data) throw new NotFoundException("Order not found");
    if(data.user.toString() !== user && data.cleaners.every(c => c.user !== user)) data = null;

    return {message: "Order retreved successfully", data}
  }

  async cancel(_id: string, user: string){
    const order = await Order.findOne({ _id, user })
    if(!order) throw new NotFoundException("Order not found");

    await order.updateOne({ status: "cancelled"})

    return {
      message: "Order concelled successfully",
      data: null
    }
  }
  complete(){}
  confirmDelivery(){}
}

export default new Service
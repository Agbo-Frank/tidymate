import dayjs from "dayjs";
import Order from "../../model/order";
import { IAddCleaner, ICreateOrder, IProcessPayment, IReOrder, IReview, ITip } from "./interface";
import { BadRequestException, NotFoundException, ServiceError } from "../../utility/service-error";
import { compareStrings, responsHandler } from "../../utility/helpers";
import Wallet from "../../model/wallet";
import Card from "../../model/cards";
import numeral from "numeral"
import { chargeCard } from "../../service/stripe/charge-card";
import Transaction from "../../model/transaction";
import Cleaner, { ICleaner } from "../../model/cleaner";
import Review from "../../model/review";
import { Response} from "express"
import { createPayment } from "../../service/paypal";
import { StatusCodes } from "http-status-codes";

class Service {
  async create(payload: ICreateOrder, user: string){
    const { service, note, start_date, location, config } = payload
    const order = new Order({
      service, note, 
      user,
      location, config,
      scheduled_at: dayjs.unix(start_date).toISOString()
    })

    await order.save()

    return {message: "Order created successfully", data: order}
  }

  async reorder(payload: IReOrder, user: string){
    const order = await Order.findById(payload.order).lean()
    if(!order) throw new NotFoundException("Order not found ");

    const newOrder = new Order({
      user, service: order.service,
      config: order.config,
      images: order.images,
      paid: false,
      status: "pending",
      location: order.location,
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

    if(!compareStrings(order.status, "pending")){
      throw new NotFoundException(`This order has been ${order.status}`)
    }

    const ids = payload.cleaners.concat(order.cleaners.map(c => c.user.toString()))
    const cleaners = await Cleaner.find({ user: ids })
    let data = []
    if(cleaners.length > 0){
      data = this.selectLeader(cleaners)
      await order.updateOne({ cleaners: data } )
    }

    return { message: "Cleaners added successfully", data }
  }

  async processPayment(res: Response, payload: IProcessPayment, user: string){
    const order = await Order.findById(payload.order)
    if(!order) throw new NotFoundException("Order not found");

    if(compareStrings(payload.method, "wallet")){
      const wallet = await Wallet.findOne({ user })
      if(wallet.balance < order.amount){
        throw new BadRequestException("Insufficient balance, please fund your wallet")
      }
      wallet.balance = numeral(wallet.balance).subtract(order.amount).value()
      await wallet.save()
      
      order.paid = true

      await wallet.save()
      await order.save()
      
      const tx = await Transaction.create({
        wallet: wallet.id,
        status: "successful",
        narration: "Service charge",
        amount: order.amount,
        type: "charge"
      })

      return responsHandler(res, "Payment completed", StatusCodes.OK, tx)
    }

    if(compareStrings(payload.method, "card")){
      const card = await Card.findById(payload.card)
      if(!card) throw new NotFoundException("card not found");
      
      const result = await chargeCard({
        amount: order.amount, 
        payment_method: card.reference,
        metadata: { order: order.id }
      })
      order.metadata = { payment: result.id }
      await order.save()
      //TODO: handle the webhook

      return responsHandler(
        res, 
        "Processing payment...", 
        StatusCodes.CREATED, 
        null
      )
    }

    if(compareStrings(payload.method, "paypal")){
      createPayment(order.amount, "Order payment", "order", async (err, result) => {
        if(err){
          throw new ServiceError(err.message, err.httpStatusCode, err.response.details)
        }
        else {
          order.metadata = { payment: result.id }
          await order.save()

          return responsHandler(
            res, 
            "Processing payment...", 
            StatusCodes.CREATED, 
            { link: result.link, id: result.id }
          )
        }
      })
    }
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

  async review(payload: IReview[], user: string){
    if(payload.length === 0){
      throw new BadRequestException("Review can't be empty")
    }
    const reviews = []
    for (let i = 0; i < payload.length; i++) {
      const review = payload[i]
      await Cleaner.updateOne(
        { user: review.cleaner },
        {$inc: {
          "rating.num_of_rating": 1,
          "rating.value_of_rating": review.rate
        }}
      )
      reviews.push({...review, user})
    }
    const data = await Review.insertMany(reviews)

    return { message: "Thanks for your review", data }
  }

  async tip(payload: ITip, user: string){
    const order = await Order.findById(payload.order)
    if(!order) throw new NotFoundException("Order not found");

    const wallet = await Wallet.findOne({ user })
    if(!wallet) throw new NotFoundException("Wallet not found");
    if(wallet.balance < payload.amount) throw new BadRequestException("Insufficient balance to cover tip");

    wallet.balance = numeral(wallet.balance).subtract(payload.amount).value()
    order.tip = payload.amount

    await wallet.save()
    await order.save()

    //TODO: disburbes the tip amoungst the cleaners
    return { message: "Tip recieved successfully", data: null }
  }

  complete(){}
  confirmDelivery(){
    /**
     * during confirmation ensure the user(homeowner) has completed payment
     * create a transaction and with a type commission and status pending
     * add tip if there's any
     * 
     */
  }

  private selectLeader(users: ICleaner[]){
    let highest = -Infinity;
    let leader = null;
    
    users.forEach(user => {
      if (user.avg_rating > highest) {
        highest = user.avg_rating;
        leader = user.user;
      }
    });

    return users.map(user => ({
      user: user.user,
      leader: user.user == leader
    }));
  }
  
}

export default new Service
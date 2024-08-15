import dayjs from "dayjs";
import Order from "../../model/order";
import { IAddCleaner, ICreateOrder, IProcessPayment, IReOrder, IReview, ITip } from "./interface";
import { BadRequestException, NotFoundException, ServiceError, UnauthorizedException } from "../../utility/service-error";
import { compareStrings, geocoder, responsHandler } from "../../utility/helpers";
import Card from "../../model/cards";
import numeral from "numeral"
import { chargeCard } from "../../service/stripe/charge-card";
import Transaction from "../../model/transaction";
import Cleaner, { ICleaner } from "../../model/cleaner";
import Review from "../../model/review";
import { Response} from "express"
import { createPayment } from "../../service/paypal";
import { StatusCodes } from "http-status-codes";
import User, { IUser } from "../../model/user";
import History from "../../model/history";

class Service {
  async create(payload: ICreateOrder, user: string){
    const { service, note, num_cleaners = 1, start_date, coordinates, config } = payload

    const amount = this.calculateOrderAmount(config.bedroom)

    const order = new Order({
      service, note, amount,
      user, num_cleaners,
      location: { coordinates }, config,
      scheduled_at: dayjs.unix(start_date).toISOString()
    })

    const location = await geocoder(coordinates)
    if(location){
      order.location.address = location.formatted_address
      await History.create({
        address: location.formatted_address,
        coordinates,
        user, name: location.formatted_address,
        // type:
      })
    }
    await order.save()

    return { message: "Order created successfully", data: order }
  }

  async reorder(payload: IReOrder, user: string){
    const order = await Order.findById(payload.order).lean()
    if(!order) throw new NotFoundException("Order not found ");

    const newOrder = new Order({
      user, service: order.service || "home",
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
    const cleaners = await Cleaner.find({ user: ids }).populate("first_name last_name avatar")
    let data = []
    if(cleaners.length > 0){
      data = this.selectLeader(cleaners as any)
      await order.updateOne({ cleaners: data } )
    }

    return { message: "Cleaners added successfully", data }
  }

  async processPayment(res: Response, payload: IProcessPayment, user_id: string){
    const order = await Order.findById(payload.order)
    if(!order) throw new NotFoundException("Order not found");

    if(compareStrings(payload.method, "wallet")){
      const user = await User.findById(user_id)
      if(user.balance < order.amount){
        throw new BadRequestException("Insufficient balance, please fund your wallet")
      }
      user.balance = numeral(user.balance).subtract(order.amount).value()
      await user.save()
      
      order.paid = true

      await user.save()
      await order.save()
      
      const tx = await Transaction.create({
        user: user_id,
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
    const data = await Order.paginate(
      { user }, {sort: {created_at: -1}}
    )
    return {message: "Orders retreved successfully", data}
  }

  async getOrder(id: string, user: string){
    try{
      let data = await Order.findById(id)
      if(!data) throw new NotFoundException("Order not found");
      if(data.user.toString() !== user && data.cleaners.every(c => c.user !== user)){
        throw new UnauthorizedException("Order not found")
      }

      return {message: "Order retreved successfully", data }
    }catch(err){
      console.log(err)
      return null
    }
    
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

  async tip(payload: ITip, user_id: string){
    const order = await Order.findById(payload.order)
    if(!order) throw new NotFoundException("Order not found");

    const user = await User.findById(user_id)
    if(!user) throw new NotFoundException("Wallet not found");
    if(user.balance < payload.amount) {
      throw new BadRequestException("Insufficient balance to cover tip");
    }

    user.balance = numeral(user.balance).subtract(payload.amount).value()
    order.tip = payload.amount

    await user.save()
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

  private selectLeader(users: (ICleaner&{user: IUser})[]){
    let highest = -Infinity;
    let leader = null;
    
    users.forEach(user => {
      if (user.avg_rating > highest) {
        highest = user.avg_rating;
        leader = user.user;
      }
    });

    return users.map(user => ({
      name: user.user?.first_name + " " + user.user?.last_name,
      avatar: user.user?.avatar || null,
      user: user.user?._id,
      leader: user.user == leader
    }));
  }
  
  private calculateOrderAmount(num_of_bedrooms){
    const baserate = 30;
    const ave_hrs_per_room = 1;

    const totalHours = num_of_bedrooms * ave_hrs_per_room;

    return totalHours * baserate;
  }
}

export default new Service()
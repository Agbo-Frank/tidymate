import Cleaner, { ICleaner } from "../../model/cleaner"
import Order from "../../model/order"
import { compareStrings, isEmpty } from "../../utility/helpers"
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../utility/service-error"
import { FilterQuery } from "mongoose"
import { IUploaDocs, ISetLocation, ICreateRequest } from "./interface"
import cloudinary from "../../service/cloudinary"
import Request from "../../model/request"
import dayjs from "dayjs"
import User, { IUser } from "../../model/user"

class Service {

  async orders(user: string){
    try {
      const data = await Order.paginate(
        { "cleaners": { $elemMatch: { user } } },
        {
          sort: {created_at: -1},
          populate: { path: "user", select: "first_name last_name phone_number avatar" }
        }
      )
      return { message: "Orders retreved successfully", data }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async pendingOrders(){
    try {
      const data = await Order.paginate(
        { status: "pending", paid: true },
        { 
          sort: { created_at: -1 },
          populate: { path: "user", select: "first_name last_name phone_number avatar" }
        }
      )

      return { message: "New orders retreved successfully", data }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async cancel(id: string, user: string){
    const order = await Order.findById(id)
    if(!order) throw new NotFoundException("Order not found");
    
    //TODO: handle when the cleaner to be removed is a leader
    await order.updateOne({$pull: { cleaners:  { user } }})

    return { message: "Order declined successfully", data: null}
  }

  async start(id: string, user: string){
    const order = await Order.findById(id)
    if(!order) throw new NotFoundException("Order not found");
    if(!compareStrings(order.status, "pending")){
      throw new NotFoundException(`Order is ${order.status}`);
    }

    const cleaner = order.cleaners.find(c => c.user == user)
    if(!cleaner || !cleaner.leader){
      throw new BadRequestException("Only Assigned team lead can start or commerce cleaning")
    }

    const data = await Order.findByIdAndUpdate(
      id, 
      { started_at: dayjs().toISOString(), status: "ongoing" },
      { new: true }
    )
      .populate({ path: "user", select: "first_name last_name phone_number avatar" })

    return { message: "Order commerced successfully", data }
  }

  async end(id: string, user: string){
    const order = await Order.findById(id)
    if(!order) throw new NotFoundException("Order not found");

    const cleaner = order.cleaners.find(c => c.user == user)
    if(!cleaner || !cleaner.leader){
      throw new UnauthorizedException("Only Assigned team lead can start or commerce cleaning")
    }
    if(isEmpty(order.started_at)){
      throw new UnauthorizedException("Order hasn't started")
    }
    const actual_duration = dayjs().diff(dayjs(order.started_at), "hours")
    if(actual_duration < order.estimated_duration){
      throw new UnauthorizedException("You can't end this order till it's exceeds the estimated duration")
    }

    const data = await Order.findByIdAndUpdate(
      id, 
      { ended_at: dayjs().toISOString(), actual_duration, status: "ended"},
      { new: true }
    )

    return { message: "Order ended successfully", data }
  }

  async accept(id: string, user_id: string){
    const order = await Order.findById(id)
    if(!order) throw new NotFoundException("Order not found");
    if(!compareStrings(order.status, "pending")){
      throw new BadRequestException(`This order has been ${order.status}`)
    }

    if(order.cleaners.some(c => c.user === user_id)){
      throw new BadRequestException(`You've already accepted this order`)
    }
    
    if( order.cleaners.length  >= order.num_cleaners){
      throw new BadRequestException(`This order has exceded the maximum number of cleaners`)
    }

    const user = await User.findById(user_id)
    if(!user) throw new NotFoundException("User not found");
    if(isEmpty(user.cleaner)) throw new NotFoundException("User is not a registered cleaner");

    const ids = order.cleaners.map(c => c.user.toString())
    const cleaners = await Cleaner.find({ user: ids }).populate("user", "first_name last_name avatar")
    let data = []
    if(cleaners.length > 0){
      data = this.selectLeader(cleaners as any)
      console.log(data)
      await order.updateOne({ cleaners: data } )
    }

    return { message: "Order accepted successfully", data: null }
  }

  async decline(id: string, user: string){
    const order = await Order.findById(id)
    if(!order) throw new NotFoundException("Order not found");

    if(!compareStrings(order.status, "pending")){
      //TODO: charge the user if the order is no longer pending and he has once accepted the order
      // throw new BadRequestException(`This order has been ${order.status}`)
    }

    if(!order.cleaners.some(c => c.user === user)){
      throw new BadRequestException(`You've not accepted this order`)
    }

    await order.updateOne({  $unset: { cleaners: { user } } })
    return { message: "Order declined successfully", data: null}
  }

  async requestKit(payload: ICreateRequest, user: string){
    const cleaner = await Cleaner.findOne({ user })
    if(!cleaner) throw new NotFoundException("Cleaner not found");
    if(!cleaner.isverified()) {
      throw new NotFoundException("Cleaner's kyc hasn't being verified, try again later");
    }
    // const req = await Request.findOne({ user })
    // if(req || req.balance)
    const data = await Request.create({
      user,
      phone_number: payload.phone_number,
      location: {
        house_num: payload?.house_num,
        address: payload?.address,
        city: payload?.city,
        state: payload.state,
        postal_code:payload.postal_code
      }
    })

    return { message: "Request recieved successfully", data: null }
  }

  paymentMethod(){}
  
  async profile(user: string){
    const data = await Cleaner.findOne({ user }).select("-docs").populate("user", "-password")

    return {
      message: "Cleaner's profile retrieved successfully",
      data
    }
  }

  async getCleaners(query){
    const filters = this.filters(query)

    // TODO: ensure to only return verified cleaners 
    const data = await Cleaner.find({ 
      $and: filters.length > 0 ? filters : [{}]
    }).populate("user", "-password").select("-docs")

    return {
      message: "Cleaners retrieved successfully",
      data: data?.filter(i => !isEmpty(i.user))
    }
  }

  async uploadDocs(payload: IUploaDocs, user: string){
    try {
      const { image, type } = payload
      const cleaner = await Cleaner.findOne({ user })
      if(!cleaner) throw new NotFoundException("Cleaner not found");

      const result = await cloudinary.uploader.upload(image, { folder: '/docs' })
      if(!result) throw new BadRequestException("Couldn't upload docs, please try again")

      const doc = cleaner.docs.find(d => compareStrings(d.type, type))
      if(!doc){
        cleaner.docs.push({ type, url: result.secure_url})
      }
      else doc.url = result.secure_url;

      await cleaner.save()

      return { message: "Upload successful", data: cleaner.docs }
    }catch (error) {
     throw new BadRequestException("Couldn't upload docs, please try again")
    }
  }

  async kycStatus(user: string){
    const cleaner = await Cleaner.findOne({ user })
    if(!cleaner) throw new NotFoundException("Cleaner not found")

    return {
      message: "Cleaner's KYC Status retrieved successfully",
      data: cleaner.docs
    }
  }

  async setLocation(payload: ISetLocation, user: string){
    const cleaner = await Cleaner.findOne({ user })
    if(!cleaner) throw new NotFoundException("Cleaner not found");
    
    await cleaner.updateOne({ 
      location: {
        coordinates: [ payload.long, payload.lat ]
      } 
    })

    return { message: "Location set successfully", data: null}
  }

  private filters(payload: any){
    const allowed_filters = ["lat"]
    const queries: FilterQuery<any>[] = []
    const _filters = Object.entries(payload)

    for (let i = 0; i < _filters.length; i++) {
      if(!allowed_filters.includes(_filters[i][0])) continue;
      if(compareStrings(_filters[i][0], "lat")){
        queries.push({
          location: { $near: {
            $geometry: { 
              type: 'Point',
              coordinates: [payload?.long, payload?.lat]
            },
            spherical: true,
            distanceField: 'distance',
            $maxDistance: 5000  // Distance in meters
          }}
        })
      }
      else queries.push({[_filters[i][0]]: { $regex: new RegExp(`${_filters[i][1]}`), $options: "i"}})
    }

    return queries
  }

  private selectLeader(users: (ICleaner & { user: IUser })[]){
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
}

export default new Service()
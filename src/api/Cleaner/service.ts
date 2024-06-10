import Cleaner from "../../model/cleaner"
import Order from "../../model/order"
import { compareStrings } from "../../utility/helpers"
import { BadRequestException, NotFoundException } from "../../utility/service-error"
import { FilterQuery } from "mongoose"
import { IUploaDocs, ISetLocation, ICreateRequest } from "./interface"
import cloudinary from "../../service/cloudinary"
import Request from "../../model/request"

class Service {

  async orders(user: string){
    const data = await Order.find({ cleaners: { $elemMatch: { user } } })

    return {message: "Orders retreved successfully", data}
  }

  async cancel(id: string, user: string){
    const order = await Order.findById(id)
    if(!order) throw new NotFoundException("Order not found");
    
    //TODO: handle when the cleaner to be removed is a leader
    await order.updateOne({$pull: { cleaners:  { user } }})

    return { message: "Order declined successfully", data: null}
  }

  async accept(id: string, user: string){
    const order = await Order.findById(id)
    if(!order) throw new NotFoundException("Order not found");

    const cleaner_order = order.cleaners.find(c => c.user == user)
    if(!cleaner_order) throw new NotFoundException("Order not found or has been declined");

    cleaner_order.accepted = true
    await order.save()

    return { message: "Order accepted successfully", data: null}
  }

  async requestKit(payload: ICreateRequest, user: string){
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

    return { message: "Request recieved successfully", data }
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

    const data = await Cleaner.find({ 
      $and: filters.length > 0 ? filters : [{}]
    }).populate("user", "-password")

    return {
      message: "Cleaners retrieved successfully",
      data
    }
  }

 async uploadDocs(payload: IUploaDocs, user: string){
    try {
      const { image, type } = payload
      const cleaner = await Cleaner.findOne({ user })
      if(!cleaner) throw new NotFoundException("Cleaner not found");

      const result = await cloudinary.uploader.upload(image, {folder: '/docs'})
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
}

export default new Service()
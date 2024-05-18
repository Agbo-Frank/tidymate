import Order from "../../model/order"

class Service {

  async orders(user: string){
    const data = await Order.find({ cleaners: { $elemMatch: { user } } })

    return {message: "Orders retreved successfully", data}
  }

  requestKit(){}
  profile(){}
  getCleaners(){}
  kyc(){
    //docs: proof of work, photo, gov id, background check
  }
}

export default new Service()
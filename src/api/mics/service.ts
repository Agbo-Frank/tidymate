import axios from "axios"
import { BadRequestException, ServiceError } from "../../utility/service-error"
import History from "../../model/history"
import { IDirection } from "./interface"
import { GOOGLE_API_KEY } from "../../utility/config"
import { compareStrings } from "../../utility/helpers"

class Service {

  async getDirection(payload: IDirection){
    try {
      const params = new URLSearchParams()
      params.append("key", GOOGLE_API_KEY)
      Object.entries(payload).forEach(v => {
        if(typeof v[1] === "string"){
          params.append(v[0], v[1]);
        }
        if(Array.isArray(v[1])){
          params.append(v[0], v[1].join(","));
        }
      })

      const { data } = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`)
      if(!compareStrings("OK", data?.status)){
        throw new BadRequestException(data?.error_message || "Unable to get direction")
      }

      return { data, message: "direction fetched successfully" }
    } catch (error) {
      if(error instanceof ServiceError){
        throw error
      }
      throw new BadRequestException("Unable to get direction")
    }
  }
  async locationSearch(payload){
    const _payload: any = { textQuery: payload?.search }
    if("location" in payload){
      const [ latitude, longitude ] = payload.location
      _payload.locationBias = {
        "circle": {
          "center": { longitude, latitude },
          "radius": 500.0
        }
      }
    }
    
    try {
      const { data } = await axios.post(
        "https://places.googleapis.com/v1/places:searchText", 
        _payload,
        { 
          headers: {
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.primaryType",
            "X-Goog-Api-Key": GOOGLE_API_KEY
          }
        }
      )

      return { 
        data: data?.places.map(p => ({...p, name: p?.displayName?.text, type: p?.primaryType, address: p?.formattedAddress})), 
        message: "Location search successful" 
      }
    } catch (error) {
      throw new BadRequestException("Location search unsuccessful")
    }
    
  }

  async autoCompleteSearch(payload){
    const _payload: any = { input: payload?.search }
    if("coordinates" in payload){
      const [ latitude, longitude ] = payload.coordinates
      _payload.locationBias = {
        "circle": {
          "center": { longitude, latitude },
          "radius": 500.0
        }
      }
    }
    
    try {
      const { data } = await axios.post(
        "https://places.googleapis.com/v1/places:autocomplete", 
        _payload,
        { headers: { "X-Goog-Api-Key": GOOGLE_API_KEY} }
      )

      return { 
        data: data?.suggestions.map(p => p?.placePrediction), 
        message: "Location search successful" 
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException("Location search unsuccessful")
    }
    
  }

  async history(user: string){
    const data = await History.find({ user })
    return { data, message: "location history retrieved" }
  }

}

export default new Service()
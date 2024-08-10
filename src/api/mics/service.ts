import axios from "axios"
import { BadRequestException } from "../../utility/service-error"
import History from "../../model/history"

class Service {

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
            "X-Goog-Api-Key": "AIzaSyDFaorQOBfhVVUl1xsHzvimciVJxvj2H5g"
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
        { headers: { "X-Goog-Api-Key": "AIzaSyDFaorQOBfhVVUl1xsHzvimciVJxvj2H5g" } }
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
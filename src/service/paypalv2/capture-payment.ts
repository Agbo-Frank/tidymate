import { ProviderError } from "../../utility/service-error"
import client from "./client"

export async function capturePayment(id: string){
  try{
    const { data } = await client.post(`checkout/orders/${id}/capture`)
    return data
  } catch(error) {
    console.log(error)
    throw new ProviderError("paypal", error)
  }
}
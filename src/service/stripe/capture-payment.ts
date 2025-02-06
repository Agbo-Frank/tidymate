import { ProviderError } from "../../utility/service-error";
import client from "./client";

export async function captureCardPayment(id: string) {
  try {
    const result = await client.post(`/payment_intents/${id}/capture`)
    return result?.data
  } catch (error) {
    console.log(error?.response?.data?.error)
    throw new ProviderError("stripe", error)
  }
}
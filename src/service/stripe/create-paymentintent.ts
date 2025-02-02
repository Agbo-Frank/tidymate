import { ProviderError } from "../../utility/service-error";
import client from "./client";
import { IStripePaymentIntent } from "./interface";

export async function createPaymentIntent(payload: Partial<IStripePaymentIntent>) {
  try {
    const result = await client.post("/payment_intents", payload)
    return result?.data
  } catch (error) {
    console.log(error?.response?.data?.error)
    throw new ProviderError("stripe", error)
  }
}
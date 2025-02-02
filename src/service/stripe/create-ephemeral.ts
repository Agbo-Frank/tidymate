import { ProviderError } from "../../utility/service-error";
import client from "./client";

export async function createEphemeralKey(customer_id: string) {
  try {
    const result = await client.post(
      "/ephemeral_keys",
      { customer: customer_id },
      { headers: { "Stripe-Version": '2024-06-20' } }
    )
    return result?.data
  } catch (error) {
    throw new ProviderError("stripe", error)
  }
}
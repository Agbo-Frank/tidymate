import { ProviderError } from "../../utility/service-error";
import client from "./client";
import { IStripeCustomer } from "./interface";

export async function createCusomer(payload: Partial<IStripeCustomer>): Promise<IStripeCustomer> {
  try {
    const result = await client.post("/customers", payload)
    return result?.data
  } catch (error) {
    throw new ProviderError("stripe", error)
  }
}
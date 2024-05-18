import { ProviderError } from "../../utility/service-error";
import client from "./client";
import { IChargeCard, ICreateCardResult } from "./interface";

export async function chargeCard(payload: IChargeCard): Promise<ICreateCardResult>{
  try {
    const result = await client.post("/payment_intents", { confirm: true, ...payload })
    return result?.data
  } catch (error) {
    throw new ProviderError("stripe", error)
  }
}
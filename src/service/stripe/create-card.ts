import { ProviderError } from "../../utility/service-error";
import client from "./client";
import { ICreateCard, ICreateCardResult } from "./interface";

export async function createCard(payload: ICreateCard): Promise<ICreateCardResult>{
  try {
    const result = await client.post("/payment_methods", { card: payload, type: "card"})
    return result?.data
  } catch (error) {
    throw new ProviderError("stripe", error)
  }
}
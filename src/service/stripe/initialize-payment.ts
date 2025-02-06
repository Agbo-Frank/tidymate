import numeral from "numeral";
import { STRIPE_PUBLICKEY } from "../../utility/config";
import { isEmpty } from "../../utility/helpers";
import { ProviderError } from "../../utility/service-error";
import { createCusomer } from "./create-customer";
import { createEphemeralKey } from "./create-ephemeral";
import { createPaymentIntent } from "./create-paymentintent";
import { IInitializePayment, IInitializePaymentResult } from "./interface";

export async function initializeCardPayment(payload: IInitializePayment): Promise<IInitializePaymentResult> {
  try {
    const { name, email, amount, description } = payload
    let { customer_id } = payload
    if (isEmpty(customer_id)) {
      const customer = await createCusomer({ name, email })
      customer_id = customer.id
    }

    const ephemeral = await createEphemeralKey(customer_id)
    const paymentIntent = await createPaymentIntent({
      amount: numeral(amount).multiply(100).value(),
      customer: customer_id,
      currency: "usd",
      description,
      payment_method_types: ['card']
    })

    return {
      id: paymentIntent.id,
      ephemeral_key: ephemeral.secret,
      customer_id,
      publishable_key: STRIPE_PUBLICKEY,
      payment_secret: paymentIntent.client_secret,
    }

  } catch (error) {
    throw new ProviderError("stripe", error)
  }
}
import numeral from "numeral";
import client from "./client";
import { ProviderError } from "../../utility/service-error";
import url from "url"

export async function createPayment({ reference, amount, description, callback_url }){
  try {
    callback_url = new URL(callback_url)
    const _url = (status) => {
      const params = new URLSearchParams(callback_url.search)
      params.append("status", status)
      return url.resolve(callback_url.href, params.toString())
    }
    const payload =  {
      "intent": "CAPTURE", 
      "purchase_units": [ 
        { 
          "custom_id": reference, 
          "amount": { "currency_code": "USD", "value": numeral(amount).format("0.00") },
          description 
        } 
      ],
      "payment_source": { 
        "paypal": { 
          "experience_context": { 
            "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED", 
            "brand_name": "Tidymates", 
            "locale": "en-US", 
            "landing_page": "NO_PREFERENCE",
            "user_action": "PAY_NOW",
            "return_url": _url("success"), 
            "cancel_url": _url("cancel")
          } 
        } 
      } 
    }

    const { data } = await client.post("/checkout/orders", payload)
    return data
  } catch (error) {
    console.log(error)
    throw new ProviderError("paypal", error)
  }
}
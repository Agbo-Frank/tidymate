import { SDKError } from "paypal-rest-sdk";
import paypal, { callback_url } from ".";
import { compareStrings } from "../../utility/helpers";

type Resources = "wallet" | "order" | "subscription"
export function createPayment(amount: number, description: string, resources: Resources, cb: (err: SDKError, result: {link: string, id: string}) => any) {
  const payload = {
    "intent": "sale",
    "payer": { "payment_method": "paypal" },
    "redirect_urls": {
      "return_url": `${callback_url}/${resources}/success`,
      "cancel_url": `${callback_url}/${resources}/failed`
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Tidymates service",
          "sku": "item",
          "price": String(amount),
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": { "currency": "USD", "total": String(amount) },
      description
    }]
  };

  return paypal.payment.create(payload, function (error, payment){
    if (error) return cb(error, null);
    else {
      const link = payment.links.find(link => compareStrings(link.rel, "approval_url"))
      JSON.stringify(payment, null, 2)
      return cb(null, { link: link.href, id: payment.id })
    }
  });
}
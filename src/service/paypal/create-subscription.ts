import { SDKError } from "paypal-rest-sdk";
import paypal, { callback_url } from ".";
import { compareStrings } from "../../utility/helpers";
import dayjs from "dayjs";


export function createSubscription(amount = 10, cb: (err: SDKError, result: {link: string, id: string}) => any){
  const payload = {
    "description": "Subscription plan for Tidyplus",
    "merchant_preferences": {
      "auto_bill_amount": "yes",
      "cancel_url": `${callback_url}/subscription/failed`,
      "initial_fail_amount_action": "continue",
      "max_fail_attempts": "3",
      "return_url": `${callback_url}/subscription/success`,
      "setup_fee": { "currency": "USD", "value": "1" }
    },
    "name": "Tidymate",
    "payment_definitions": [
      {
        "amount": { "currency": "USD", "value": String(amount)},
        "cycles": "0",
        "frequency": "MONTH",
        "frequency_interval": "1",
        "name": "Tidyplus plan",
        "type": "REGULAR"
      }
    ],
    "type": "INFINITE"
  };

  return paypal.billingPlan.create(payload, function (error, plan) {
    if (error) return cb(error, null);
    paypal.billingPlan.update(
      plan.id, 
      [{ "op": "replace", "path": "/", "value": { "state": "ACTIVE" } }], 
      (error, response) => {
        if (error) return cb(error, null);

        const agreement_payload = {
          name: "Fast Speed Agreement",
          description: "Agreement for Fast Speed Plan",
          start_date: dayjs().add(4, "seconds"),
          plan: { id: plan.id },
          payer: { payment_method: "paypal" }
        }

        paypal.billingAgreement.create(
          agreement_payload, 
          (error, payment) => {
            if (error) return cb(error, null);
            console.log("Agreement: ", payment);
            const link = payment.links.find(link => compareStrings(link.rel, "approval_url"))
            return cb(null, { link: link.href, id: payment.id })
          }
        );
      }
    )
  });
}
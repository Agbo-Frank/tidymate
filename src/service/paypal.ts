import paypal, { PaymentResponse, Payment, SDKError } from "paypal-rest-sdk"
import { compareStrings } from "../utility/helpers";

type Resources = "wallet" | "order" | "subscription"
const callback_url = "https://7317-197-210-84-14.ngrok-free.app/webhook/paypal"

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Aacl3MsHMlV2DbwR4NvmARc-Eg4JAFcK79r76Et_WCVSicl3whohlbYlIDNoSGy2dA8qpSPDf43cG1Cn',
  'client_secret': 'EKoMDcpjlcTSf0KhuMofw7EvvgTP71q3htGqa3DDOleoPLNeUyrP9UdlblxxhICEGkdjxGZBftAzcg4b'
});

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

export function executePayment(amount: number, payer_id: string, payment_id: string, cb: (err: SDKError, result: PaymentResponse) => any){
  const payload = {
    payer_id,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": String(amount)
      }
    }]
  };

  return paypal.payment.execute(payment_id, payload, function (error, payment) {
    if (error) return cb(error, null);
    else return cb(null, payment)
  });
}

export function creatSub(){
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
        "amount": { "currency": "USD", "value": "100"},
        "cycles": "0",
        "frequency": "MONTH",
        "frequency_interval": "1",
        "name": "Tidyplus plan",
        "type": "REGULAR"
      }
    ],
    "type": "INFINITE"
  };

  paypal.billingPlan.create(payload, function (error, billingPlan) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Create Billing Plan Response");
      console.log(billingPlan);
    }
  });
}


export default paypal
// more reference: https://github.com/paypal/PayPal-node-SDK.git
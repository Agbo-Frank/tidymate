import { PaymentResponse, SDKError } from "paypal-rest-sdk";
import paypal from ".";

export function executePayment(amount: number, payer_id: string, payment_id: string, cb: (err: SDKError, result: PaymentResponse) => any){
  const payload = {
    payer_id,
    "transactions": [{
      "amount": { "currency": "USD", "total": String(amount) }
    }]
  };

  return paypal.payment.execute(payment_id, payload, function (error, payment) {
    if (error) return cb(error, null);
    else return cb(null, payment)
  });
}
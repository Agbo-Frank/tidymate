import { PaymentResponse, SDKError } from "paypal-rest-sdk";
import paypal from ".";

export function executeSubscription(token: string, cb: (err: SDKError, result: PaymentResponse) => any){

  return paypal.billingAgreement.execute(token, { }, function (error, payment) {
    if (error) return cb(error, null);
    else return cb(null, payment)
  });
}
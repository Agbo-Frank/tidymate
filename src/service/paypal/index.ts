import paypal from "paypal-rest-sdk"
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "../../utility/config";

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': String(PAYPAL_CLIENT_ID),
  'client_secret': String(PAYPAL_CLIENT_SECRET)
});

export default paypal

export const callback_url = "https://3f2c-102-90-48-231.ngrok-free.app/callback/paypal"
export * from "./create-payment"
export * from "./create-subscription"
export * from "./execute-payment"
export * from "./execute-subscription"
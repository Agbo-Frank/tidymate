import paypal from "paypal-rest-sdk";
export default paypal;
export declare const callback_url = "https://c209-102-90-66-90.ngrok-free.app/callback/paypal";
export * from "./create-payment";
export * from "./create-subscription";
export * from "./execute-payment";
export * from "./execute-subscription";

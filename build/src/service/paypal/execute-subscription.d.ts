import { PaymentResponse, SDKError } from "paypal-rest-sdk";
export declare function executeSubscription(token: string, cb: (err: SDKError, result: PaymentResponse) => any): void;

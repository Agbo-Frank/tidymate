import { PaymentResponse, SDKError } from "paypal-rest-sdk";
export declare function executePayment(amount: number, payer_id: string, payment_id: string, cb: (err: SDKError, result: PaymentResponse) => any): void;

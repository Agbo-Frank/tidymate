import { SDKError } from "paypal-rest-sdk";
export declare function createSubscription(amount: number, cb: (err: SDKError, result: {
    link: string;
    id: string;
}) => any): void;

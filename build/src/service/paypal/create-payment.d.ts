import { SDKError } from "paypal-rest-sdk";
type Resources = "wallet" | "order" | "subscription";
export declare function createPayment(amount: number, description: string, resources: Resources, cb: (err: SDKError, result: {
    link: string;
    id: string;
}) => any): void;
export {};

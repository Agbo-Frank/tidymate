/**
 * the intent can be CAPTURE or AUTHORIZE
 * CAPTURE is for instant capture of payment like initiating an immediate payment
 * AUTHORIZE is for authorizing payment  that will need to be captured later
 */
export declare function createPayment({ reference, amount, description, callback_url, intent }: {
    reference: any;
    amount: any;
    description: any;
    callback_url: any;
    intent?: string;
}): Promise<any>;

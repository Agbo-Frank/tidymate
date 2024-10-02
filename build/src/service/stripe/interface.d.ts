export interface ICreateCard {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
}
export interface IChargeCard {
    amount: number;
    payment_method: string;
    metadata?: any | {};
}
export interface ICreateCardResult {
    id: string;
    object: string;
    billing_details: {
        address: {
            city: string | null;
            country: string | null;
            line1: string | null;
            line2: string | null;
            postal_code: string | null;
            state: string | null;
        };
        email: string | null;
        name: string | null;
        phone: string | null;
    };
    card: {
        brand: string;
        checks: {
            address_line1_check: string | null;
            address_postal_code_check: string | null;
            cvc_check: "unchecked";
        };
        country: string;
        exp_month: number;
        exp_year: number;
        fingerprint: string;
        funding: string;
        generated_from: string | null;
        last4: string;
        networks: {
            available: string[];
            preferred: string;
        };
        wallet: null;
    };
    created: number;
    customer: string | null;
    livemode: boolean;
    metadata: any;
    type: string;
}

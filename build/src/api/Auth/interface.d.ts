export interface ILogin {
    email: string;
    password: string;
}
export interface IVerifyOtp {
    email: string;
    code: string;
}
export interface IRegister {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    type: string;
    referral_code: string;
}

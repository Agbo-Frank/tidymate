/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { ILogin, IRegister, IVerifyOtp } from "./interface";
declare class Service {
    login(payload: ILogin): Promise<{
        message: string;
        data: {
            token: string;
            user: {
                kyc_required: boolean;
                _id: string;
                first_name: string;
                last_name: string;
                gender: string;
                email: string;
                phone_number: string;
                provider: string[];
                password: string;
                avatar: string;
                balance: number;
                escrow: number;
                currency: string;
                roles: string;
                email_verified: boolean;
                referral_code: string;
                created_at: string;
                socket: string;
                cleaner: string | typeof import("mongoose").Types.ObjectId;
            };
            role: string;
        };
    }>;
    loginWithGoogle({ redirect_url }: {
        redirect_url: any;
    }): Promise<{
        message: string;
        data: {
            url: string;
        };
    }>;
    getGoogleProfile({ code }: {
        code: any;
    }): Promise<{
        message: string;
        data: {
            token: string;
            user: {
                kyc_required: boolean;
                _id: string;
                first_name: string;
                last_name: string;
                gender: string;
                email: string;
                phone_number: string;
                provider: string[];
                password: string;
                avatar: string;
                balance: number;
                escrow: number;
                currency: string;
                roles: string;
                email_verified: boolean;
                referral_code: string;
                created_at: string;
                socket: string;
                cleaner: string | typeof import("mongoose").Types.ObjectId;
            };
            role: string;
        };
    }>;
    register(payload: IRegister): Promise<{
        message: string;
        data: any;
    }>;
    verifyOtp(payload: IVerifyOtp): Promise<{
        message: string;
        data: string;
    }>;
    resetPassword(payload: any, user: string): Promise<{
        message: string;
        data: any;
    }>;
}
declare const _default: Service;
export default _default;

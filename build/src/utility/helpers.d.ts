import { Response, Request } from "express";
import { IChargePayload } from "./interface";
export declare function randNum(len?: number): string;
export declare const randAlphaNum: (len?: number) => string;
export declare const compareStrings: (str1: string, str2: string) => boolean;
export declare const isEmpty: (mixedVar: any) => boolean;
export declare const maskEmail: (email: string) => string;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const validateRequest: (req: Request) => void;
export declare const responsHandler: (res: Response, message: string, status?: number, data?: any) => void;
export declare const pagingParams: (req: Request) => {
    limit: number;
    page: number;
    pagination: boolean;
};
export declare const charge: (method: string, payload: IChargePayload, cb: (err, result) => any) => Promise<any>;
export declare const geocoder: (payload: string | number[]) => Promise<{
    formatted_address: any;
    coordinates: any[];
}>;

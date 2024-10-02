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
import { IUser } from "../../model/user";
import { IChangePassword } from "./interface";
import { Response } from "express";
import { IPagination } from "../../utility/interface";
declare class Service {
    profile(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, IUser> & IUser & Required<{
            _id: string;
        }>;
    }>;
    update(payload: Partial<IUser & {
        avatar: string;
    }>, user_id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, IUser> & IUser & Required<{
            _id: string;
        }>;
    }>;
    changePassword(payload: IChangePassword, user_id: string): Promise<{
        message: string;
        data: any;
    }>;
    referral(user: string): Promise<{
        message: string;
        data: {
            num_of_invites: number;
            balance: number;
        };
    }>;
    subscribe(res: Response, payload: any, id: string): Promise<void>;
    cancelSub(payload: any, user: string): Promise<{
        message: string;
        data: any;
    }>;
    subStatus(user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/subscription").ISubscription> & import("../../model/subscription").ISubscription & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    notifications(id: string, pagination: IPagination): Promise<{
        data: import("mongoose").PaginateResult<import("mongoose").Document<unknown, {
            sort: {
                created_at: string;
            };
            page: number;
            limit: number;
            paginate?: boolean;
        }, import("../../model/notifications").INotification> & import("../../model/notifications").INotification & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        message: string;
    }>;
}
declare const _default: Service;
export default _default;

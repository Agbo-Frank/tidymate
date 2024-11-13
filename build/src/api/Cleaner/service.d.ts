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
import { ICleaner } from "../../model/cleaner";
import { IUploaDocs, ISetLocation, ICreateRequest } from "./interface";
declare class Service {
    orders(user: string): Promise<{
        message: string;
        data: import("mongoose").PaginateResult<import("mongoose").Document<unknown, {
            sort: {
                created_at: number;
            };
            populate: {
                path: string;
                select: string;
            };
        }, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    pendingOrders(): Promise<{
        message: string;
        data: import("mongoose").PaginateResult<import("mongoose").Document<unknown, {
            sort: {
                created_at: number;
            };
            populate: {
                path: string;
                select: string;
            };
        }, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    cancel(id: string, user: string): Promise<{
        message: string;
        data: any;
    }>;
    start(id: string, user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    end(id: string, user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    accept(id: string, user_id: string): Promise<{
        message: string;
        data: any;
    }>;
    decline(id: string, user: string): Promise<{
        message: string;
        data: any;
    }>;
    requestKit(payload: ICreateRequest, user: string): Promise<{
        message: string;
        data: any;
    }>;
    paymentMethod(): void;
    profile(user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, ICleaner> & ICleaner & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getCleaners(query: any): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, ICleaner> & ICleaner & {
            _id: import("mongoose").Types.ObjectId;
        })[];
    }>;
    uploadDocs(payload: IUploaDocs, user: string): Promise<{
        message: string;
        data: import("../../model/cleaner").IDoc[];
    }>;
    kycStatus(user: string): Promise<{
        message: string;
        data: import("../../model/cleaner").IDoc[];
    }>;
    setLocation(payload: ISetLocation, user: string): Promise<{
        message: string;
        data: any;
    }>;
    private filters;
    private selectLeader;
}
declare const _default: Service;
export default _default;

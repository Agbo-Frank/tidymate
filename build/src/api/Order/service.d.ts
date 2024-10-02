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
import { IAddCleaner, ICreateOrder, IProcessPayment, IReOrder, IReview, ITip } from "./interface";
declare class Service {
    create(payload: ICreateOrder, user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    update(payload: any, user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    reorder(payload: IReOrder, user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    addCleaners(payload: IAddCleaner, user: string): Promise<{
        message: string;
        data: any[];
    }>;
    processPayment(payload: IProcessPayment, user_id: string): Promise<{
        message: string;
        data: any;
    }>;
    getOrders(payload: any, user: string): Promise<{
        message: string;
        data: import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    getOrder(id: string, user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/order").IOrder> & import("../../model/order").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    cancel(_id: string, user: string): Promise<{
        message: string;
        data: any;
    }>;
    review(payload: IReview, user: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/review").IReview> & import("../../model/review").IReview & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    tip(payload: ITip, user_id: string): Promise<{
        message: string;
        data: any;
    }>;
    complete(id: string, user: string): Promise<{
        message: string;
        data: any;
    }>;
    private selectLeader;
    private calculateOrderAmount;
}
declare const _default: Service;
export default _default;

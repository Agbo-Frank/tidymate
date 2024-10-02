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
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { PaginateModel, Types } from "mongoose";
interface IOrderCleaner {
    user: string | typeof Types.ObjectId;
    name: string;
    avatar: string;
    accepted: boolean;
    leader: boolean;
}
export interface IOrder {
    user: string | typeof Types.ObjectId;
    service: string;
    note: string;
    config: {
        bedroom: number;
        livingroom: number;
        bathroom: number;
        store: number;
        balcony: number;
    };
    num_cleaners: number;
    images: string[];
    scheduled_at: string;
    started_at: string;
    ended_at: string;
    estimated_duration: number;
    actual_duration: number;
    amount: number;
    tip: number;
    currency: string;
    paid: boolean;
    payment_ref: string;
    status: string;
    cleaners: IOrderCleaner[];
    payment_method: string;
    metadata: any;
    location: {
        address: string;
        coordinates: number[];
    };
}
declare const Order: PaginateModel<IOrder, {}, {}>;
export default Order;

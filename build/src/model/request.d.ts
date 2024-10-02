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
import { Schema, Types } from "mongoose";
export interface IRequest {
    user: string | typeof Types.ObjectId;
    balance: number;
    amount: number;
    status: string;
    phone_number: string;
    location: {
        address: string;
        house_num: string;
        city: string;
        state: string;
        postal_code: string;
    };
}
declare const Request: import("mongoose").Model<IRequest, {}, {}, {}, import("mongoose").Document<unknown, {}, IRequest> & IRequest & {
    _id: Types.ObjectId;
}, Schema<IRequest, import("mongoose").Model<IRequest, any, any, any, import("mongoose").Document<unknown, any, IRequest> & IRequest & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IRequest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IRequest>> & import("mongoose").FlatRecord<IRequest> & {
    _id: Types.ObjectId;
}>>;
export default Request;

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
import { Schema } from "mongoose";
export interface ISubscription {
    amount: number;
    currency: string;
    payment_method: string;
    user: string;
    status: string;
    due_at: string;
    note?: string;
    card: string;
    metadata: any;
}
declare const Subscription: import("mongoose").Model<ISubscription, {}, {}, {}, import("mongoose").Document<unknown, {}, ISubscription> & ISubscription & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<ISubscription, import("mongoose").Model<ISubscription, any, any, any, import("mongoose").Document<unknown, any, ISubscription> & ISubscription & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ISubscription, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ISubscription>> & import("mongoose").FlatRecord<ISubscription> & {
    _id: import("mongoose").Types.ObjectId;
}>>;
export default Subscription;

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
import { Types } from "mongoose";
export interface IDoc {
    type: "proof_of_work" | "profile" | "gov_id" | "back_check";
    url: string;
    verified?: boolean;
}
export interface ICleaner {
    user: string | typeof Types.ObjectId;
    code: string;
    earnings: number;
    available: boolean;
    verified: boolean;
    completed_order: number;
    rating: {
        num_of_rating: number;
        value_of_rating: number;
    };
    avg_rating: number;
    location: {
        type: string;
        coordinates: Number[];
    };
    isverified: () => boolean;
    docs: IDoc[];
}
declare const Cleaner: import("mongoose").Model<ICleaner, {}, {}, {}, import("mongoose").Document<unknown, {}, ICleaner> & ICleaner & {
    _id: Types.ObjectId;
}, any>;
export default Cleaner;

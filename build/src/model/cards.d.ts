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
export interface ICard {
    user: string;
    last4: string;
    brand: string;
    name: string;
    reference: string;
    provider: string;
}
declare const Card: import("mongoose").Model<ICard, {}, {}, {}, import("mongoose").Document<unknown, {}, ICard> & ICard & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<ICard, import("mongoose").Model<ICard, any, any, any, import("mongoose").Document<unknown, any, ICard> & ICard & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ICard, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ICard>> & import("mongoose").FlatRecord<ICard> & {
    _id: import("mongoose").Types.ObjectId;
}>>;
export default Card;

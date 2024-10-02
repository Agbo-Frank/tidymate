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
import { ICard } from "./interface";
declare class Service {
    create(payload: ICard, user_id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../model/cards").ICard> & import("../../model/cards").ICard & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    list(user: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../../model/cards").ICard> & import("../../model/cards").ICard & {
            _id: import("mongoose").Types.ObjectId;
        })[];
    }>;
    del(_id: string, user: string): Promise<{
        message: string;
        data: any;
    }>;
}
declare const _default: Service;
export default _default;

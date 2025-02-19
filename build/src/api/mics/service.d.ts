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
import { IDirection } from "./interface";
declare class Service {
    getDirection(payload: IDirection): Promise<{
        data: any;
        message: string;
    }>;
    locationSearch(payload: any): Promise<{
        data: any;
        message: string;
    }>;
    autoCompleteSearch(payload: any): Promise<{
        data: any;
        message: string;
    }>;
    history(user: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../model/history").IHistory> & import("../../model/history").IHistory & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        message: string;
    }>;
}
declare const _default: Service;
export default _default;

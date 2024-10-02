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
import { IPagination } from "../../utility/interface";
import { IDeposit } from "./interface";
declare class Service {
    deposit(payload: IDeposit, user_id: string): Promise<{
        message: string;
        data: any;
    }>;
    withdraw(): void;
    transactions(user: string, { limit, page }: IPagination): Promise<{
        message: string;
        data: import("mongoose").PaginateResult<import("mongoose").Document<unknown, {
            page: number;
            limit: number;
            sort: {
                updated_at: string;
            };
        }, import("../../model/transaction").ITransaction> & import("../../model/transaction").ITransaction & {
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
}
declare const _default: Service;
export default _default;

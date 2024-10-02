"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const cleanerOrder = new mongoose_1.Schema({
    order: {
        type: mongoose_1.Types.ObjectId,
        ref: "order"
    },
    cleaner: {
        type: mongoose_1.Types.ObjectId,
        ref: "cleaner"
    },
    accepted: { type: Boolean, default: false },
    leader: { type: Boolean, default: false },
    metadata: mongoose_1.Schema.Types.Mixed
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
cleanerOrder.plugin(mongoose_paginate_v2_1.default);
// const CleanerOrder = model<ICleanerOrder, PaginateModel<ICleanerOrder>>("cleanerorder", cleanerOrder)
// export default CleanerOrder
//# sourceMappingURL=cleanerorders.js.map
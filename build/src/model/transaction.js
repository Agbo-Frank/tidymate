"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const transaction = new mongoose_1.Schema({
    amount: Number,
    status: {
        type: String,
        default: "pending"
    },
    fee: {
        type: Number,
        default: 0
    },
    type: String,
    user: String,
    narration: String,
    payment_method: String,
    payment_ref: String,
    metadata: mongoose_1.Schema.Types.Mixed
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
transaction.plugin(mongoose_paginate_v2_1.default);
const Transaction = (0, mongoose_1.model)("transaction", transaction);
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map
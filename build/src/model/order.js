"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const orderCleaner = new mongoose_1.Schema({
    user: {
        type: String,
        ref: "User"
    },
    name: String,
    avatar: String,
    accepted: {
        type: Boolean,
        default: false
    },
    leader: {
        type: Boolean,
        default: false
    }
});
const order = new mongoose_1.Schema({
    service: String,
    note: String,
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User"
    },
    config: {
        bedroom: { type: Number, default: 0 },
        livingroom: { type: Number, default: 0 },
        bathroom: { type: Number, default: 0 },
        store: { type: Number, default: 0 },
        balcony: { type: Number, default: 0 }
    },
    num_cleaners: { type: Number, default: 1 },
    estimated_duration: Number,
    actual_duration: Number,
    images: [String],
    scheduled_at: Date,
    started_at: Date,
    ended_at: Date,
    amount: { type: Number },
    tip: { type: Number, default: 0 },
    currency: String,
    paid: { type: Boolean, default: false },
    payment_ref: String,
    status: {
        type: String,
        default: "pending"
    },
    cleaners: [orderCleaner],
    payment_method: String,
    location: {
        address: String,
        coordinates: [Number]
    },
    metadata: mongoose_1.Schema.Types.Mixed
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
order.plugin(mongoose_paginate_v2_1.default);
const Order = (0, mongoose_1.model)("order", order);
exports.default = Order;
//# sourceMappingURL=order.js.map
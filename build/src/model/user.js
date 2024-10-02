"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
exports.methods = {
    "wallet": "wallet",
    "card": "card",
    "paypal": "paypal"
};
const user = new mongoose_1.Schema({
    avatar: {
        type: String,
        default: null
    },
    first_name: String,
    last_name: String,
    email: {
        type: String,
        lowercase: true,
        index: true,
        unique: true
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    currency: String,
    balance: {
        type: Number,
        default: 0
    },
    phone_number: {
        type: String,
        trim: true
    },
    password: String,
    roles: String,
    cleaner: {
        type: mongoose_1.Types.ObjectId,
        ref: "cleaner"
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
user.plugin(mongoose_paginate_v2_1.default);
const User = (0, mongoose_1.model)("User", user);
exports.default = User;
//# sourceMappingURL=user.js.map
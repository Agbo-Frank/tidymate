"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const request = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User"
    },
    balance: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 100
    },
    status: {
        type: String,
        default: "pending",
        enum: ["received", "approved", "completed", "pending"]
    },
    phone_number: String,
    location: {
        address: String,
        house_num: String,
        city: String,
        state: String,
        postal_code: String,
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
const Request = (0, mongoose_1.model)("request", request);
exports.default = Request;
//# sourceMappingURL=request.js.map
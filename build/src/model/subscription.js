"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subscription = new mongoose_1.Schema({
    amount: Number,
    payment_method: String,
    currency: String,
    user: String,
    note: String,
    status: {
        type: String,
        default: "pending"
    },
    due_at: String,
    card: String,
    metadata: mongoose_1.Schema.Types.Mixed
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
const Subscription = (0, mongoose_1.model)("subscription", subscription);
exports.default = Subscription;
//# sourceMappingURL=subscription.js.map
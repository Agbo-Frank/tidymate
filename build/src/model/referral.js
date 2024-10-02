"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const referral = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User"
    },
    referee: {
        type: mongoose_1.Types.ObjectId,
        ref: "User"
    },
    reward: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: "USD"
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
const Referral = (0, mongoose_1.model)("referral", referral);
exports.default = Referral;
//# sourceMappingURL=referral.js.map
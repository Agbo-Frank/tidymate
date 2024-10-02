"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const review = new mongoose_1.Schema({
    order: {
        type: mongoose_1.Types.ObjectId,
        ref: "order"
    },
    rate: {
        type: Number,
        default: 0
    },
    comment: String
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
const Review = (0, mongoose_1.model)("review", review);
exports.default = Review;
//# sourceMappingURL=review.js.map
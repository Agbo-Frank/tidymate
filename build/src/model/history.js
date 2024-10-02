"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const history = new mongoose_1.Schema({
    name: String,
    address: String,
    user: String,
    type: String,
    coordinates: [Number],
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
const History = (0, mongoose_1.model)("history", history);
exports.default = History;
//# sourceMappingURL=history.js.map
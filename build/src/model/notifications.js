"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const notification = new mongoose_1.Schema({
    title: String,
    body: String,
    users: [String],
    views: [String],
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
notification.plugin(mongoose_paginate_v2_1.default);
const Notification = (0, mongoose_1.model)("notification", notification);
exports.default = Notification;
//# sourceMappingURL=notifications.js.map
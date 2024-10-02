"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const config_1 = require("../utility/config");
cloudinary_1.default.v2.config({
    cloud_name: config_1.CLOUDINARY_NAME,
    api_key: config_1.CLOUDINARY_API_KEY,
    api_secret: config_1.CLOUDINARY_API_SECRET
});
exports.default = cloudinary_1.default.v2;
//# sourceMappingURL=cloudinary.js.map
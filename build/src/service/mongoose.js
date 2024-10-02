"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.connectMongodb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../utility/config");
function connectMongodb() {
    mongoose_1.default.set("strictQuery", false);
    mongoose_1.default.connect(config_1.MONGODB_URL, { autoIndex: false })
        .then(() => console.log("MongoDB connected successfully..."))
        .catch((err) => console.log("MongoDB Error just occured " + err));
}
exports.connectMongodb = connectMongodb;
exports.connection = mongoose_1.default.connection;
exports.default = mongoose_1.default;
//# sourceMappingURL=mongoose.js.map
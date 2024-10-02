"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const logger_1 = __importDefault(require("../utility/logger"));
const client = (0, redis_1.createClient)();
const logger = new logger_1.default("server");
client.on("error", (err) => logger.log('Redis Client Error', err));
client.on("connect", () => logger.log('Redis connected...'));
exports.default = client;
//# sourceMappingURL=redis.js.map
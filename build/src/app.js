"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const mongoose_1 = require("./service/mongoose");
const logger_1 = __importDefault(require("./utility/logger"));
const api_1 = __importDefault(require("./api"));
const redis_1 = __importDefault(require("./service/redis"));
const http_1 = require("http");
const logger = new logger_1.default("server");
const app = (0, express_1.default)();
redis_1.default.connect();
(0, mongoose_1.connectMongodb)();
app.set('trust proxy', 1);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json({ limit: "10mb" }));
app.use((req, _, next) => {
    logger.log(`${req.method.toUpperCase()} ${req.url}`);
    next();
});
(0, api_1.default)(app);
app.use(error_handler_1.default);
app.disable('x-powered-by');
const server = (0, http_1.createServer)(app);
exports.default = server;
//# sourceMappingURL=app.js.map
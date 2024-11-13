"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const io = new socket_io_1.Server(app_1.default, {
    connectionStateRecovery: {}
});
io.on("connection", socket => {
    console.log(socket);
});
exports.default = io;
//# sourceMappingURL=io.js.map
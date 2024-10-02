"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logfmt_1 = __importDefault(require("logfmt"));
class Logger {
    constructor(service) {
        this.name = service;
    }
    log(message, opts = {}) {
        const logData = logfmt_1.default.stringify(Object.assign(opts, { component: this.name }));
        if (message) {
            process.stdout.write(`${message} ${logData}` + '\n');
        }
        else {
            process.stdout.write(`${logData}` + '\n');
        }
    }
    error(message, opts = {}) {
        const logData = logfmt_1.default.stringify(Object.assign(opts, { component: this.name }));
        if (message) {
            process.stderr.write(`${message} ${logData}` + '\n');
        }
        else {
            process.stderr.write(`${logData}` + '\n');
        }
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map
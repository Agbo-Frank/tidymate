"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./utility/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utility/logger"));
const config = __importStar(require("./utility/config"));
const helpers_1 = require("./utility/helpers");
const logger = new logger_1.default("server");
if (Object.values(config).some(value => (0, helpers_1.isEmpty)(value))) {
    Object.entries(config).forEach(values => {
        if ((0, helpers_1.isEmpty)(values[1]))
            console.log(`${values[0]} is undefined`);
    });
    throw new Error("Please enter all config values");
}
else {
    app_1.default.listen(config_1.PORT, () => {
        logger.log(`Application runing on port ${config_1.PORT}...`);
    });
}
//# sourceMappingURL=index.js.map
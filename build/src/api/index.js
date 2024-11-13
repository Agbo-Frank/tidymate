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
const router_1 = __importDefault(require("./Auth/router"));
const router_2 = __importDefault(require("./User/router"));
const router_3 = __importDefault(require("./Order/router"));
const router_4 = __importDefault(require("./Card/router"));
const routes_1 = __importDefault(require("./Wallet/routes"));
const routes_2 = __importDefault(require("./webhook/routes"));
const routes_3 = __importDefault(require("./Cleaner/routes"));
const routes_4 = __importDefault(require("./mics/routes"));
const guard_1 = __importStar(require("../middleware/guard"));
function default_1(app) {
    app.use("/auth", router_1.default);
    app.use(routes_2.default);
    app.use(guard_1.guardValid, guard_1.default, routes_4.default);
    app.use("/wallet", guard_1.guardValid, guard_1.default, routes_1.default);
    app.use("/", guard_1.guardValid, guard_1.default, router_4.default);
    app.use("/users", guard_1.guardValid, guard_1.default, router_2.default);
    app.use("/orders", guard_1.guardValid, guard_1.default, router_3.default);
    app.use("/cleaners", guard_1.guardValid, guard_1.default, routes_3.default);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map
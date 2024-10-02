"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const router = (0, express_1.Router)();
router.get("/callback/paypal/:resources/:status", controller_1.default.paypal);
router.post("/webhook/paypal", controller_1.default.paypal);
exports.default = router;
//# sourceMappingURL=routes.js.map
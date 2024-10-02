"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("/orders", validator_1.default.create, controller_1.default.create);
router.put("/orders", controller_1.default.update);
router.get("/orders", controller_1.default.getOrders);
router.get("/orders/:id", controller_1.default.getOrder);
router.put("/order/cleaner", validator_1.default.addCleaner, controller_1.default.addCleaners);
router.put("/orders/reorder", validator_1.default.reorder, controller_1.default.reorder);
router.put("/orders/tip", validator_1.default.tip, controller_1.default.tip);
router.post("/orders/review", validator_1.default.review, controller_1.default.review);
router.delete("/orders/cancel/:id", controller_1.default.cancel);
router.post("/orders/complete/:id", controller_1.default.complete);
router.post("/orders/pay", validator_1.default.processPayment, controller_1.default.processPayment);
exports.default = router;
//# sourceMappingURL=router.js.map
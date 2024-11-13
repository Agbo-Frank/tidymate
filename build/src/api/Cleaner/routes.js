"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.get("/orders", controller_1.default.orders);
router.get("/pending/orders", controller_1.default.pendingOrders);
router.get("/profile", controller_1.default.profile);
router.get("/", controller_1.default.getCleaners);
router.post("/order/accept/:id", controller_1.default.accept);
router.post("/order/decline/:id", controller_1.default.decline);
router.post("/order/end/:id", controller_1.default.end);
router.post("/order/start/:id", controller_1.default.start);
router.delete("/order/cancel/:id", controller_1.default.cancel);
router.post("/request-kit", validator_1.default.requestKit, controller_1.default.requestKit);
router.get("/kyc-status", controller_1.default.kycStatus);
router.post("/set-location", validator_1.default.setLocation, controller_1.default.setLocation);
router.post("/upload-docs", validator_1.default.uploadDocs, controller_1.default.uploadDocs);
exports.default = router;
//# sourceMappingURL=routes.js.map
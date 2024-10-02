"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.get("/cleaners/orders", controller_1.default.orders);
router.get("/cleaners/profile", controller_1.default.profile);
router.get("/cleaners", controller_1.default.getCleaners);
router.post("/cleaners/order/accept/:id", controller_1.default.accept);
router.post("/cleaners/order/end/:id", controller_1.default.end);
router.post("/cleaners/order/start/:id", controller_1.default.start);
router.delete("/cleaners/order/cancel/:id", controller_1.default.cancel);
router.post("/cleaners/request-kit", validator_1.default.requestKit, controller_1.default.requestKit);
router.get("/cleaners/kyc-status", controller_1.default.kycStatus);
router.post("/cleaners/set-location", validator_1.default.setLocation, controller_1.default.setLocation); //TODO: Add validation
router.post("/cleaners/upload-docs", validator_1.default.uploadDocs, controller_1.default.uploadDocs);
exports.default = router;
//# sourceMappingURL=routes.js.map
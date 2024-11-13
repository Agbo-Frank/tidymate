"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.get("/profile", controller_1.default.profile);
router.get("/notifications", controller_1.default.notifications);
router.put("/profile", controller_1.default.update);
router.post("/change-password", validator_1.default.changePassword, controller_1.default.changePassword);
router.post("/subcription", validator_1.default.subscribe, controller_1.default.subscribe);
router.get("/subcription", controller_1.default.subStatus);
router.delete("/subcription", controller_1.default.cancelSub);
exports.default = router;
//# sourceMappingURL=router.js.map
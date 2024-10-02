"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.get("/users/profile", controller_1.default.profile);
router.get("/users/notifications", controller_1.default.notifications);
router.put("/users/profile", controller_1.default.update);
router.post("/users/change-password", validator_1.default.changePassword, controller_1.default.changePassword);
router.post("/users/subcription", validator_1.default.subscribe, controller_1.default.subscribe);
router.get("/users/subcription", controller_1.default.subStatus);
router.delete("/users/subcription", controller_1.default.cancelSub);
exports.default = router;
//# sourceMappingURL=router.js.map
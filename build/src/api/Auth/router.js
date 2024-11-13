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
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const validator_1 = __importStar(require("./validator"));
const guard_1 = __importStar(require("../../middleware/guard"));
const router = (0, express_1.Router)();
router.post("/login", validator_1.default.login, controller_1.default.login);
router.get("/google", validator_1.default.loginWithGoogle, controller_1.default.loginWithGoogle);
router.get("/google/profile", validator_1.default.loginWithGoogle, controller_1.default.getGoogleProfile);
router.post("/register", validator_1.default.register, controller_1.default.register);
router.post("/send-otp", validator_1.emailValidator, controller_1.default.sendOTP);
router.post("/verify-otp", validator_1.default.verifyOtp, controller_1.default.verifyOtp);
router.post("/reset-password", validator_1.passwordValidator, guard_1.guardValid, guard_1.default, controller_1.default.resetPassword);
exports.default = router;
//# sourceMappingURL=router.js.map
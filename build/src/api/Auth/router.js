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
// passport.use(new GoogleStrategy({
//   clientID: "1085337230569-a0o0pj4uotd96mittl6ecohe9crnanfc.apps.googleusercontent.com",
//   clientSecret: "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",
//   callbackURL: '/oauth2/redirect/google',
//   scope: [ 'profile' ]
// }, function verify(issuer, profile, cb) {
//   console.log(issuer, profile)
// }))
// passport.serializeUser(function(user, cb) {
//   process.nextTick(function() {
//     console.log(user)
//     // cb(null, { id: user.id, username: user.username, name: user.name });
//   });
// });
// passport.deserializeUser(function(user, cb) {
//   process.nextTick(function() {
//     return cb(null, user);
//   });
// });
router.post("/auth/login", validator_1.default.login, controller_1.default.login);
// router.get("/auth/google", passport.authenticate('google'))
router.post("/auth/register", validator_1.default.register, controller_1.default.register);
router.post("/auth/send-otp", validator_1.emailValidator, controller_1.default.sendOTP);
router.post("/auth/verify-otp", validator_1.default.verifyOtp, controller_1.default.verifyOtp);
router.post("/auth/reset-password", validator_1.passwordValidator, guard_1.guardValid, guard_1.default, controller_1.default.resetPassword);
exports.default = router;
//# sourceMappingURL=router.js.map
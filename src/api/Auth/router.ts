import { Router } from "express";
import cltr from "./controller"
import valid, { emailValidator, passwordValidator } from "./validator"
import guard, { guardValid } from "../../middleware/guard";

const router = Router()

router.post("/login", valid.login, cltr.login)
router.get("/google", valid.loginWithGoogle, cltr.loginWithGoogle)
router.get("/google/profile", valid.loginWithGoogle, cltr.getGoogleProfile)
router.post("/register", valid.register, cltr.register)
router.post("/send-otp", emailValidator, cltr.sendOTP)
router.post("/verify-otp", valid.verifyOtp, cltr.verifyOtp)
router.post("/reset-password", passwordValidator, guardValid, guard, cltr.resetPassword)

export default router
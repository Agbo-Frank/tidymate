import { Router } from "express";
import cltr from "./controller"
import valid, { emailValidator, passwordValidator } from "./validator"
import guard, { guardValid } from "../../middleware/guard";

const router = Router()

router.post("/auth/login", valid.login, cltr.login)
router.post("/auth/register", valid.register, cltr.register)
router.post("/auth/send-otp", emailValidator, cltr.sendOTP)
router.post("/auth/verify-otp", valid.verifyOtp, cltr.verifyOtp)
router.post("/auth/reset-password", passwordValidator, guardValid, guard, cltr.resetPassword)

export default router
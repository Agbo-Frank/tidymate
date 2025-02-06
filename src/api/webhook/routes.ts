import { Router } from "express";
import cltr from "./controller"

const router = Router()

router.get("/callback/paypal/:resources/:status", cltr.paypal)
router.post("/webhook/paypal", cltr.paypal)
router.post("/webhook/stripe", cltr.stripe)

export default router
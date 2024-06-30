import { Router } from "express";
import cltr from "./controller"

const router = Router()

router.get("/webhook/paypal/:resources/:status", cltr.paypal)

export default router
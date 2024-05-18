import { Router } from "express";
import cltr from "./controller"

const router = Router()

router.get("/cleaners/orders", cltr.orders)
router.get("/cleaners/profile",  cltr.profile)
router.get("/cleaners", cltr.getCleaners)

export default router
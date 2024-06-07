import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.post("/orders", valid.create, cltr.create)
router.get("/orders",  cltr.getOrders)
router.get("/orders/:id",  cltr.getOrder)
router.put("/order/cleaner", valid.addCleaner, cltr.addCleaners)
router.put("/orders/reorder", valid.reorder, cltr.reorder)
router.delete("/orders/cancel/:id", cltr.cancel)
router.post("/orders/pay", valid.processPayment, cltr.processPayment)

export default router
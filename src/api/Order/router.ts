import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.post("/orders", valid.create, cltr.create)
router.put("/orders", cltr.update)
router.get("/orders",  cltr.getOrders)
router.get("/orders/:id",  cltr.getOrder)
router.put("/order/cleaner", valid.addCleaner, cltr.addCleaners)
router.put("/orders/reorder", valid.reorder, cltr.reorder)
router.put("/orders/tip", valid.tip, cltr.tip)
router.post("/orders/review", valid.review, cltr.review)
router.delete("/orders/cancel/:id", cltr.cancel)
router.post("/orders/pay", valid.processPayment, cltr.processPayment)

export default router
import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.post("/", valid.create, cltr.create)
router.put("/", cltr.update)
router.get("/",  cltr.getOrders)
router.get("/:id",  cltr.getOrder)
router.get("/:id/cleaners",  cltr.getOrderCleaners)
router.put("/reorder", valid.reorder, cltr.reorder)
router.put("/tip", valid.tip, cltr.tip)
router.post("/review", valid.review, cltr.review)
router.delete("/cancel/:id", cltr.cancel)
router.post("/complete/:id", cltr.complete)
router.post("/pay", valid.processPayment, cltr.processPayment)

export default router
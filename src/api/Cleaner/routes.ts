import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.get("/orders", cltr.orders)
router.get("/pending/orders", cltr.pendingOrders)
router.get("/profile",  cltr.profile)
router.get("/", cltr.getCleaners)
router.post("/order/accept/:id", cltr.accept)
router.post("/order/decline/:id", cltr.decline)
router.post("/order/end/:id", cltr.end)
router.post("/order/start/:id", cltr.start)
router.delete("/order/cancel/:id", cltr.cancel)
router.post("/request-kit", valid.requestKit, cltr.requestKit)
router.get("/kyc-status", cltr.kycStatus)
router.post("/set-location", valid.setLocation, cltr.setLocation)
router.post("/upload-docs", valid.uploadDocs, cltr.uploadDocs)

export default router
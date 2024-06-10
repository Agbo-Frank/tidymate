import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.get("/cleaners/orders", cltr.orders)
router.get("/cleaners/profile",  cltr.profile)
router.get("/cleaners", cltr.getCleaners)
router.get("/cleaners/accept/:id", cltr.accept)
router.delete("/cleaners/cancel/:id", cltr.cancel)
router.post("/cleaners/request-kit", valid.requestKit, cltr.requestKit)
router.get("/cleaners/kyc-status", cltr.kycStatus)
router.post("/cleaners/set-location", valid.setLocation, cltr.setLocation) //TODO: Add validation
router.post("/cleaners/upload-docs", valid.uploadDocs, cltr.uploadDocs)

export default router
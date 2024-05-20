import { Router } from "express";
import cltr from "./controller"

const router = Router()

router.get("/cleaners/orders", cltr.orders)
router.get("/cleaners/profile",  cltr.profile)
router.get("/cleaners", cltr.getCleaners)
router.get("/cleaners/kyc-status", cltr.kycStatus)
router.post("/cleaners/set-location", cltr.setLocation) //TODO: Add validation
router.post("/cleaners/upload-docs", cltr.uploadDocs) //TODO: Add validation

export default router
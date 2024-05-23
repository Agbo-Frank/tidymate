import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.get("/cleaners/orders", cltr.orders)
router.get("/cleaners/profile",  cltr.profile)
router.get("/cleaners", cltr.getCleaners)
router.get("/cleaners/request-kit", valid.requestKit, cltr.requestKit)
router.get("/cleaners/kyc-status", cltr.kycStatus)
router.post("/cleaners/set-location", cltr.setLocation) //TODO: Add validation
router.post("/cleaners/upload-docs", valid.setLocation, cltr.uploadDocs)

export default router
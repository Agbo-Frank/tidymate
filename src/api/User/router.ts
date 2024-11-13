import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.get("/profile", cltr.profile)
router.get("/notifications", cltr.notifications)
router.put("/profile", cltr.update)
router.post("/change-password", valid.changePassword, cltr.changePassword)
router.post("/subcription", valid.subscribe, cltr.subscribe)
router.get("/subcription", cltr.subStatus)
router.delete("/subcription", cltr.cancelSub)

export default router
import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.get("/users/profile", cltr.profile)
router.get("/users/notifications", cltr.notifications)
router.put("/users/profile", cltr.update)
router.post("/users/change-password", valid.changePassword, cltr.changePassword)
router.post("/users/subcription", valid.subscribe, cltr.subscribe)
router.get("/users/subcription", cltr.subStatus)
router.delete("/users/subcription", cltr.cancelSub)

export default router
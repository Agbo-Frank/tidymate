import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.post("/cards", valid.create, cltr.create)
router.get("/cards",  cltr.list)
router.delete("/cards/:id", cltr.del)

export default router
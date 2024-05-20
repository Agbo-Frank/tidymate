import { Router } from "express";
import cltr from "./controller"

const router = Router()

router.post("/cards", cltr.create)//TODO: Add validation
router.get("/cards",  cltr.list)
router.delete("/cards/:id", cltr.del)

export default router
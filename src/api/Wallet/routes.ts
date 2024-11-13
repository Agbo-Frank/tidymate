import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.post("/deposit", valid.deposit, cltr.deposit)
router.get("/transactions",  cltr.transactions)

export default router
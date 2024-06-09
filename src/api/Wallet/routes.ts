import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.post("/wallet/deposit", valid.deposit, cltr.deposit)
router.get("/wallet/transactions",  cltr.transactions)

export default router
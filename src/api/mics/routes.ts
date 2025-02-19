import { Router } from "express";
import cltr from "./controller"
import valid from "./validator"

const router = Router()

router.post("/search-location", valid.searhlocation, cltr.autoCompleteSearch)
router.get("/location-history", cltr.history)
router.post("/direction", cltr.getDirection)

export default router
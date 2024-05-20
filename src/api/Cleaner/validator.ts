import { body } from "express-validator";


export default {
  setLocation: [
    body("long").notEmpty().withMessage("Longitude must be specified").isNumeric().withMessage("Longitude must be numeric"),
    body("lat").notEmpty().withMessage("Latitude must be specified").isNumeric().withMessage("Latitude must be numeric"),
  ]
}
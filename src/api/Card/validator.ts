import { body } from "express-validator";

export default {
  create: [
    body("number").notEmpty().withMessage("Card number is required").isCreditCard().withMessage("Invalid card number"),
    body("name").notEmpty().withMessage("Card name is required"),
    body("cvc").notEmpty().withMessage("Card cvc is required").isLength({min: 3}).isNumeric().withMessage("cvc must be numeric"),
    body("exp_year").notEmpty().withMessage("card expiry year is required").isNumeric().withMessage("card expiry year  must be numeric"),
    body("exp_month").notEmpty().withMessage("card expiry month is required").isNumeric().withMessage("card expiry month must be numeric")
  ]
}
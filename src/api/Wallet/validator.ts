import { body } from "express-validator";

export default {
  deposit: [
    body("amount").notEmpty().withMessage("Amount is required").isNumeric().withMessage("Invalid amount"),
    body("method").notEmpty().withMessage("Method is required"),
    body("card").if(body("method").equals("card")).notEmpty().withMessage("Card is required").isMongoId().withMessage("Invalid card id")
  ]
}
import { body } from "express-validator";
import { methods } from "../../model/user";

export default {
  changePassword: [
    body("new_password").notEmpty().withMessage("New password is required"),
    body("old_password").notEmpty().withMessage("Old password is required")
  ],
  subscribe: [
    body("method").notEmpty().withMessage("Payment method is required").isIn(Object.values(methods)),
    body("card").if(body("method").equals("card")).notEmpty().withMessage("Card is required").isMongoId().withMessage("invalid card id")
  ]
}
import { body } from "express-validator";

export const emailValidator = body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email addresss").toLowerCase()
export const passwordValidator = body("password").notEmpty().withMessage("Password is required")

export default {
  login: [ emailValidator, passwordValidator ],
  verifyOtp: [
    emailValidator,
    body("code").notEmpty().withMessage("Code is required")
  ],
  register: [
    emailValidator, passwordValidator,
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body("type").notEmpty().withMessage("User type is required").isIn(["cleaner", "homeowner"]),
    body("phone_number").notEmpty().withMessage("Phone number is required")
  ]
}
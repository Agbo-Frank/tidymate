import { body } from "express-validator";


export default {
  setLocation: [
    body("long").notEmpty().withMessage("Longitude must be specified").isNumeric().withMessage("Longitude must be numeric"),
    body("lat").notEmpty().withMessage("Latitude must be specified").isNumeric().withMessage("Latitude must be numeric"),
  ],
  requestKit: [
    body("address").notEmpty().withMessage("Address is required"),
    body("postal_code").notEmpty().withMessage("Postal code is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("phone_number").notEmpty().withMessage("Phone number is required")
  ]
}
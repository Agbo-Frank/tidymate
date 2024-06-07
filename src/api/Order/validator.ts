import { body } from "express-validator";

export default {
  create: [
    body("service").notEmpty().withMessage("Service is required"),
    body("note").notEmpty().withMessage("Note is required"),
    body("location.address").notEmpty().withMessage("Address is required"),
    body("location.coordinates").notEmpty().withMessage("Coordinates is required").isArray().withMessage("Invalid coordinate format"),
    body("start_date").notEmpty().withMessage("Start date is required").isNumeric().withMessage("start date must be a number in unix format"),
    body("config").notEmpty().withMessage("Enter the configuration").isObject().withMessage("Config must be an object")
  ],
  addCleaner: [
    body("order").notEmpty().withMessage("Order id is required").isMongoId().withMessage("Invalid order id"),
    body("cleaners").isArray().withMessage("invalid value"),
    body("cleaners.*").isMongoId().withMessage("Invalid cleaner id")
  ],
  processPayment: [
    body("order").notEmpty().withMessage("Order id is required").isMongoId().withMessage("Invalid order id"),
    body("method").notEmpty().withMessage("Payment method is required").isIn(["wallet", "card", "paypal"]).withMessage("Invalid payment method"),
    
  ],
  reorder: [
    body("order").notEmpty().withMessage("Order id is required").isMongoId().withMessage("Invalid order id"),
    body("start_date").notEmpty().withMessage("Start date is required").isNumeric().withMessage("start date must be a number in unix format"),
  ]
}
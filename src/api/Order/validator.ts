import { body } from "express-validator";

export default {
  create: [
    body("service").notEmpty().withMessage("Service is required"),
    body("note").notEmpty().withMessage("Note is required"),
    body("location.address").notEmpty().withMessage("Address is required"),
    body("location.coordinates").notEmpty().withMessage("Coordinates is required").isArray().withMessage("Invalid coordinate format"),
    body("start_date").notEmpty().withMessage("Start date is required").isNumeric().withMessage("start date must be a number in unix format"),
    // body("config.")
  ]
}
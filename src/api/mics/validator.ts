import { body } from "express-validator";

export default {
  searhlocation: [
    body('search', 'search is required').notEmpty(),
    body("coordinates").optional().isArray().withMessage("Invalid coordinate format"),
  ],
  getDirection: [
    body("orgin").notEmpty().withMessage("Origin is required"),
    body("destination").notEmpty().withMessage("Destination is required")
  ]
}
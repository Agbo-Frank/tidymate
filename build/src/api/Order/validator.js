"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = {
    create: [
        (0, express_validator_1.body)("service").notEmpty().withMessage("Service is required"),
        // body("note").notEmpty().withMessage("Note is required"),
        // body("location.address").notEmpty().withMessage("Address is required"),
        (0, express_validator_1.body)("coordinates").notEmpty().withMessage("Coordinates is required").isArray().withMessage("Invalid coordinate format"),
        (0, express_validator_1.body)("start_date").notEmpty().withMessage("Start date is required").isNumeric().withMessage("start date must be a number"),
        (0, express_validator_1.body)("config").notEmpty().withMessage("Enter the configuration").isObject().withMessage("Config must be an object")
    ],
    addCleaner: [
        (0, express_validator_1.body)("order").notEmpty().withMessage("Order id is required").isMongoId().withMessage("Invalid order id"),
        (0, express_validator_1.body)("cleaners").isArray().withMessage("invalid value"),
        (0, express_validator_1.body)("cleaners.*").isMongoId().withMessage("Invalid cleaner id")
    ],
    processPayment: [
        (0, express_validator_1.body)("order").notEmpty().withMessage("Order id is required").isMongoId().withMessage("Invalid order id"),
        (0, express_validator_1.body)("method").notEmpty().withMessage("Payment method is required").isIn(["wallet", "card", "paypal"]).withMessage("Invalid payment method"),
        (0, express_validator_1.body)("callback_url").if((0, express_validator_1.body)("method").equals("paypal")).notEmpty().withMessage("Callback url is required"), //.isURL().withMessage("Must be a valid URL"),
        (0, express_validator_1.body)("card").if((0, express_validator_1.body)("method").equals("card")).notEmpty().withMessage("Card is required").isMongoId().withMessage("Invalid card id")
    ],
    tip: [
        (0, express_validator_1.body)("order").notEmpty().withMessage("Order id is required").isMongoId().withMessage("Invalid order id"),
        (0, express_validator_1.body)("amount").notEmpty().withMessage("Amount is required").isInt().withMessage("Amount must be an integer")
    ],
    reorder: [
        (0, express_validator_1.body)("order").notEmpty().withMessage("Order id is required").isMongoId().withMessage("Invalid order id"),
        (0, express_validator_1.body)("start_date").notEmpty().withMessage("Start date is required").isNumeric().withMessage("start date must be a number in unix format"),
    ],
    review: [
        (0, express_validator_1.body)("order").notEmpty().withMessage("Order id is required").isMongoId().withMessage("Invalid order id"),
        (0, express_validator_1.body)("rate").notEmpty().withMessage("Rate is required").isInt({ min: 0, max: 5 }).withMessage("The rating must be between the range of 1 and 5"),
        (0, express_validator_1.body)("comment").optional()
    ]
};
//# sourceMappingURL=validator.js.map
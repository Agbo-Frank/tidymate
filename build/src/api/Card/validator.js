"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = {
    create: [
        (0, express_validator_1.body)("number").notEmpty().withMessage("Card number is required").isCreditCard().withMessage("Invalid card number"),
        (0, express_validator_1.body)("name").notEmpty().withMessage("Card name is required"),
        (0, express_validator_1.body)("cvc").notEmpty().withMessage("Card cvc is required").isLength({ min: 3 }).isNumeric().withMessage("cvc must be numeric"),
        (0, express_validator_1.body)("exp_year").notEmpty().withMessage("card expiry year is required").isNumeric().withMessage("card expiry year  must be numeric"),
        (0, express_validator_1.body)("exp_month").notEmpty().withMessage("card expiry month is required").isNumeric().withMessage("card expiry month must be numeric")
    ]
};
//# sourceMappingURL=validator.js.map
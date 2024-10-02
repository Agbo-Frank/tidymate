"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = {
    deposit: [
        (0, express_validator_1.body)("amount").notEmpty().withMessage("Amount is required").isNumeric().withMessage("Invalid amount"),
        (0, express_validator_1.body)("method").notEmpty().withMessage("Method is required"),
        (0, express_validator_1.body)("callback_url").if((0, express_validator_1.body)("method").equals("paypal")).notEmpty().withMessage("Callback url is required").isURL().withMessage("Must be a valid URL"),
        (0, express_validator_1.body)("card").if((0, express_validator_1.body)("method").equals("card")).notEmpty().withMessage("Card is required").isMongoId().withMessage("Invalid card id")
    ]
};
//# sourceMappingURL=validator.js.map
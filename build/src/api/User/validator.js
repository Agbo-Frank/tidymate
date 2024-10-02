"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const user_1 = require("../../model/user");
exports.default = {
    changePassword: [
        (0, express_validator_1.body)("new_password").notEmpty().withMessage("New password is required"),
        (0, express_validator_1.body)("old_password").notEmpty().withMessage("Old password is required")
    ],
    subscribe: [
        (0, express_validator_1.body)("method").notEmpty().withMessage("Payment method is required").isIn(Object.values(user_1.methods)),
        (0, express_validator_1.body)("card").if((0, express_validator_1.body)("method").equals("card")).notEmpty().withMessage("Card is required").isMongoId().withMessage("invalid card id")
    ]
};
//# sourceMappingURL=validator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidator = exports.emailValidator = void 0;
const express_validator_1 = require("express-validator");
exports.emailValidator = (0, express_validator_1.body)("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email addresss").toLowerCase();
exports.passwordValidator = (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required");
exports.default = {
    login: [exports.emailValidator, exports.passwordValidator],
    verifyOtp: [
        exports.emailValidator,
        (0, express_validator_1.body)("code").notEmpty().withMessage("Code is required")
    ],
    register: [
        exports.emailValidator, exports.passwordValidator,
        (0, express_validator_1.body)("first_name").notEmpty().withMessage("First name is required"),
        (0, express_validator_1.body)("last_name").notEmpty().withMessage("Last name is required"),
        (0, express_validator_1.body)("last_name").notEmpty().withMessage("Last name is required"),
        (0, express_validator_1.body)("type").notEmpty().withMessage("User type is required").isIn(["cleaner", "homeowner"]),
        (0, express_validator_1.body)("phone_number").notEmpty().withMessage("Phone number is required")
    ]
};
//# sourceMappingURL=validator.js.map
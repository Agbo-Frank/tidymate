"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = {
    setLocation: [
        (0, express_validator_1.body)("long").notEmpty().withMessage("Longitude must be specified").isNumeric().withMessage("Longitude must be numeric"),
        (0, express_validator_1.body)("lat").notEmpty().withMessage("Latitude must be specified").isNumeric().withMessage("Latitude must be numeric"),
    ],
    uploadDocs: [
        (0, express_validator_1.body)("type").notEmpty().withMessage("Docs type is required").isIn(["proof_of_work", "profile", "gov_id", "back_check"]),
        (0, express_validator_1.body)("image").notEmpty().withMessage("Image is required")
    ],
    requestKit: [
        (0, express_validator_1.body)("address").notEmpty().withMessage("Address is required"),
        (0, express_validator_1.body)("postal_code").notEmpty().withMessage("Postal code is required"),
        (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
        (0, express_validator_1.body)("state").notEmpty().withMessage("State is required"),
        (0, express_validator_1.body)("phone_number").notEmpty().withMessage("Phone number is required")
    ]
};
//# sourceMappingURL=validator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = {
    searhlocation: [
        (0, express_validator_1.body)('search', 'search is required').notEmpty(),
        (0, express_validator_1.body)("coordinates").optional().isArray().withMessage("Invalid coordinate format"),
    ]
};
//# sourceMappingURL=validator.js.map
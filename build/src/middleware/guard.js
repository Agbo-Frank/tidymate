"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardValid = void 0;
const helpers_1 = require("../utility/helpers");
const express_validator_1 = require("express-validator");
const jwt_1 = __importDefault(require("../utility/jwt"));
function guard(req, _, next) {
    try {
        (0, helpers_1.validateRequest)(req);
        const token = req.header('authorization');
        const decoded = jwt_1.default.verify(token);
        req.user = decoded === null || decoded === void 0 ? void 0 : decoded.id;
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
exports.default = guard;
exports.guardValid = (0, express_validator_1.header)("authorization")
    .notEmpty().withMessage("Token is required")
    .customSanitizer(value => value === null || value === void 0 ? void 0 : value.replace('Bearer ', ''));
//# sourceMappingURL=guard.js.map
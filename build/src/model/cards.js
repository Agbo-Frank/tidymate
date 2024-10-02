"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const card = new mongoose_1.Schema({
    user: String,
    last4: String,
    brand: String,
    name: String,
    reference: String,
    provider: {
        type: String,
        default: "stripe"
    }
});
const Card = (0, mongoose_1.model)("card", card);
exports.default = Card;
//# sourceMappingURL=cards.js.map
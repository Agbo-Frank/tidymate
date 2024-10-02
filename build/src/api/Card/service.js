"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cards_1 = __importDefault(require("../../model/cards"));
const user_1 = __importDefault(require("../../model/user"));
const service_error_1 = require("../../utility/service-error");
class Service {
    async create(payload, user_id) {
        const { number, name, cvc, exp_month, exp_year } = payload;
        const user = await user_1.default.findById(user_id);
        if (!user)
            throw new service_error_1.NotFoundException("User not found");
        const result = {
            "id": "pm_1MqLiJLkdIwHu7ixUEgbFdYF",
            "card": {
                "brand": "visa",
                "exp_month": 8,
                "exp_year": 2026,
                "fingerprint": "mToisGZ01V71BCos",
                "funding": "credit",
                "last4": "4242",
            },
        }; //await createCard({number, cvc, exp_month, exp_year })
        if (!result)
            throw new service_error_1.BadRequestException("Unable to add card, please try again");
        const data = await cards_1.default.create({
            brand: result.card.brand,
            last4: result.card.last4,
            name, user: user_id,
            reference: result.id
        });
        return { message: "Card saved successfully", data };
    }
    async list(user) {
        const data = await cards_1.default.find({ user });
        return { message: "Saved cards retrieved successfully", data };
    }
    async del(_id, user) {
        const card = await cards_1.default.findOne({ user, _id });
        if (!card)
            throw new service_error_1.BadRequestException("Card not found");
        await card.deleteOne();
        return { message: "unsave card successfully", data: null };
    }
}
exports.default = new Service();
//# sourceMappingURL=service.js.map
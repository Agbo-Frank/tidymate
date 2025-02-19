"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const order_1 = __importDefault(require("../../model/order"));
const service_error_1 = require("../../utility/service-error");
const helpers_1 = require("../../utility/helpers");
const cards_1 = __importDefault(require("../../model/cards"));
const numeral_1 = __importDefault(require("numeral"));
const charge_card_1 = require("../../service/stripe/charge-card");
const transaction_1 = __importDefault(require("../../model/transaction"));
const cleaner_1 = __importDefault(require("../../model/cleaner"));
const review_1 = __importDefault(require("../../model/review"));
const paypalv2_1 = require("../../service/paypalv2");
const user_1 = __importDefault(require("../../model/user"));
const history_1 = __importDefault(require("../../model/history"));
class Service {
    async create(payload, user) {
        const { service, note, num_cleaners = 1, start_date, coordinates, config } = payload;
        const { amount, duration } = this.calculateOrderAmount(config.bedroom, num_cleaners);
        const order = new order_1.default({
            service, note, amount,
            user, num_cleaners,
            estimated_duration: duration,
            location: { coordinates }, config,
            scheduled_at: (0, helpers_1.isEmpty)(start_date) ? (0, dayjs_1.default)().toISOString() : dayjs_1.default.unix(start_date).toISOString()
        });
        const location = await (0, helpers_1.geocoder)(coordinates);
        if (location) {
            order.location.address = location.formatted_address;
            await history_1.default.create({
                address: location.formatted_address,
                coordinates,
                user, name: location.formatted_address,
                // type:
            });
        }
        await order.save();
        return { message: "Order created successfully", data: order };
    }
    async update(payload, user) {
        const { scheduled_at, coordinates, config, _id } = payload;
        const update_payload = {};
        let order = await order_1.default.findOne({ _id, user });
        if (!order)
            throw new service_error_1.NotFoundException('Order not found');
        if (!(0, helpers_1.isEmpty)(config)) {
            const { amount, duration } = this.calculateOrderAmount(config.bedroom, order.num_cleaners);
            update_payload.amount = amount;
            update_payload.estimated_duration = duration;
            update_payload.config = config;
        }
        if (!(0, helpers_1.isEmpty)(coordinates)) {
            const location = await (0, helpers_1.geocoder)(coordinates);
            if (location) {
                update_payload.location.coordinates = coordinates;
                update_payload.location.address = location.formatted_address;
            }
        }
        if (scheduled_at) {
            update_payload.scheduled_at = dayjs_1.default.unix(scheduled_at).toISOString();
        }
        await order.updateOne(update_payload);
        order = await order_1.default.findOne({ _id, user });
        return { message: "Order updated successfully", data: order };
    }
    async reorder(payload, user) {
        const order = await order_1.default.findById(payload.order).lean();
        if (!order)
            throw new service_error_1.NotFoundException("Order not found ");
        const newOrder = new order_1.default({
            user, service: order.service || "home",
            config: order.config,
            images: order.images,
            paid: false,
            status: "pending",
            location: order.location,
            scheduled_at: (0, helpers_1.isEmpty)(payload.start_date) ? (0, dayjs_1.default)().toISOString() : dayjs_1.default.unix(payload.start_date).toISOString()
        });
        await newOrder.save();
        return {
            message: "Order placed successfully",
            data: newOrder
        };
    }
    async processPayment(payload, user_id) {
        const order = await order_1.default.findById(payload.order);
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        let data = null;
        if ((0, helpers_1.compareStrings)(payload.method, "wallet")) {
            const user = await user_1.default.findById(user_id);
            if (user.balance < order.amount) {
                throw new service_error_1.BadRequestException("Insufficient balance, please fund your wallet");
            }
            user.balance = (0, numeral_1.default)(user.balance).subtract(order.amount).value();
            user.escrow = (0, numeral_1.default)(user.escrow).add(order.amount).value();
            await user.save();
            const tx = await transaction_1.default.create({
                user: user_id,
                status: "pending",
                narration: "Service charge",
                amount: order.amount,
                type: "charge"
            });
            order.payment_ref = tx === null || tx === void 0 ? void 0 : tx.id;
            order.payment_method = "wallet";
            order.paid = "initialized";
            await order.save();
        }
        if ((0, helpers_1.compareStrings)(payload.method, "card")) {
            const card = await cards_1.default.findById(payload.card);
            if (!card)
                throw new service_error_1.NotFoundException("card not found");
            const result = await (0, charge_card_1.chargeCard)({
                amount: order.amount,
                payment_method: card.reference,
                metadata: { order: order.id }
            });
            order.payment_ref = result === null || result === void 0 ? void 0 : result.id;
            order.payment_method = "card";
            order.paid = "initialized";
            await order.save();
            //TODO: handle the webhook
        }
        if ((0, helpers_1.compareStrings)(payload.method, "paypal")) {
            const result = await (0, paypalv2_1.createPayment)({
                amount: order.amount,
                reference: `ORD-${order.id.slice(-8)}`,
                description: "Order payment",
                callback_url: payload === null || payload === void 0 ? void 0 : payload.callback_url
            });
            const link = result.links.find(l => (0, helpers_1.compareStrings)(l.rel, "payer-action"));
            data = link ? { link: link === null || link === void 0 ? void 0 : link.href } : null;
            order.payment_ref = result === null || result === void 0 ? void 0 : result.id;
            order.payment_method = "paypal";
            order.paid = "initialized";
            await order.save();
        }
        return { message: "Payment initaited successfully", data };
    }
    async getOrders(payload, user) {
        const filters = [{ user }];
        if ("status" in payload) {
            filters.push({ status: payload.status });
        }
        const data = await order_1.default.paginate({ $and: filters }, { sort: { created_at: -1 } });
        return { message: "Orders retreved successfully", data };
    }
    async getOrder(id, user) {
        try {
            let data = (await order_1.default.findById(id)).toObject();
            if (!data)
                throw new service_error_1.NotFoundException("Order not found");
            const cleaner_ids = data.cleaners.map(c => c.user);
            const cleaners = await cleaner_1.default.find({ user: cleaner_ids });
            data.cleaners = data.cleaners.map(orderCleaner => {
                const cleaner = cleaners.find(c => c.user.toString() === orderCleaner.user);
                orderCleaner["avg_rating"] = cleaner.avg_rating;
                orderCleaner["coordinates"] = cleaner.location.coordinates;
                return orderCleaner;
            });
            return { message: "Order retreved successfully", data };
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async getOrderCleaners(id) {
        const order = await order_1.default.findById(id);
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        const cleaner_ids = order.cleaners.map(c => c.user);
        const data = await user_1.default.find({ _id: cleaner_ids }).populate("cleaner").select("first_name last_name avatar cleaner");
        return { message: "Order cleaners retreved successfully", data };
    }
    async cancel(_id, user) {
        const order = await order_1.default.findOne({ _id, user });
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        await order.updateOne({ status: "cancelled" });
        return {
            message: "Order concelled successfully",
            data: null
        };
    }
    async review(payload, user) {
        const order = await order_1.default.findById(payload.order).lean();
        if (!order)
            throw new service_error_1.NotFoundException("Order not found ");
        await cleaner_1.default.updateMany({ user: order.cleaners.map(c => c.user) }, { $inc: {
                "rating.num_of_rating": 1,
                "rating.value_of_rating": payload.rate
            } });
        const data = await review_1.default.create(payload);
        return { message: "Thanks for your review", data };
    }
    async tip(payload, user_id) {
        const order = await order_1.default.findById(payload.order);
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        const user = await user_1.default.findById(user_id);
        if (!user)
            throw new service_error_1.NotFoundException("Wallet not found");
        if (user.balance < payload.amount) {
            throw new service_error_1.BadRequestException("Insufficient balance to cover tip");
        }
        user.balance = (0, numeral_1.default)(user.balance).subtract(payload.amount).value();
        order.tip = payload.amount;
        await user.save();
        await order.save();
        //TODO: disburbes the tip amoungst the cleaners
        return { message: "Tip recieved successfully", data: null };
    }
    async complete(id, user_id) {
        const order = await order_1.default.findOne({ _id: id, user: user_id });
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        if (order.payment_method === "wallet") {
            const user = await user_1.default.findById(user_id);
            if (!user)
                throw new service_error_1.NotFoundException("User not found");
            user.escrow = (0, numeral_1.default)(user.escrow).subtract(order.amount).value();
            await user.save();
            await transaction_1.default.updateOne({ _id: order.payment_ref }, { status: "successful" });
            order.paid = "completed";
        }
        else if (order.payment_method === "paypal") {
            await (0, paypalv2_1.capturePayment)(order.payment_ref);
        }
        /**
         * during confirmation ensure the user(homeowner) has completed payment
         * create a transaction and with a type commission and status pending
         * add tip if there's any
         *
         */
        order.status = "completed";
        await order.save();
        return { message: "Order completed successfully", data: null };
    }
    calculateOrderAmount(num_of_bedrooms, num_cleaners) {
        const baserate = 30;
        const ave_hr_per_room = 1;
        const duration = num_of_bedrooms * ave_hr_per_room;
        return {
            duration: duration / num_cleaners,
            amount: duration * baserate
        };
    }
}
exports.default = new Service();
//# sourceMappingURL=service.js.map
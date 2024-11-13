"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cleaner_1 = __importDefault(require("../../model/cleaner"));
const order_1 = __importDefault(require("../../model/order"));
const helpers_1 = require("../../utility/helpers");
const service_error_1 = require("../../utility/service-error");
const cloudinary_1 = __importDefault(require("../../service/cloudinary"));
const request_1 = __importDefault(require("../../model/request"));
const dayjs_1 = __importDefault(require("dayjs"));
const user_1 = __importDefault(require("../../model/user"));
class Service {
    async orders(user) {
        try {
            const data = await order_1.default.paginate({ "cleaners": { $elemMatch: { user } } }, {
                sort: { created_at: -1 },
                populate: { path: "user", select: "first_name last_name phone_number avatar" }
            });
            return { message: "Orders retreved successfully", data };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async pendingOrders() {
        try {
            const currentdate = (0, dayjs_1.default)().toISOString();
            const data = await order_1.default.paginate({
                status: "pending",
                paid: "initialized",
                $expr: { $lt: [{ $size: '$cleaners' }, '$num_cleaners'] },
                scheduled_at: { $lte: currentdate }
            }, {
                sort: { created_at: -1 },
                populate: { path: "user", select: "first_name last_name phone_number avatar" }
            });
            return { message: "New orders retreved successfully", data };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async cancel(id, user) {
        const order = await order_1.default.findById(id);
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        //TODO: handle when the cleaner to be removed is a leader
        await order.updateOne({ $pull: { cleaners: { user } } });
        return { message: "Order declined successfully", data: null };
    }
    async start(id, user) {
        const order = await order_1.default.findById(id);
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        if (!(0, helpers_1.compareStrings)(order.status, "pending")) {
            throw new service_error_1.NotFoundException(`Order is ${order.status}`);
        }
        const cleaner = order.cleaners.find(c => c.user == user);
        if (!cleaner || !cleaner.leader) {
            throw new service_error_1.BadRequestException("Only Assigned team lead can start or commerce cleaning");
        }
        const data = await order_1.default.findByIdAndUpdate(id, { started_at: (0, dayjs_1.default)().toISOString(), status: "ongoing" }, { new: true })
            .populate({ path: "user", select: "first_name last_name phone_number avatar" });
        return { message: "Order commerced successfully", data };
    }
    async end(id, user) {
        const order = await order_1.default.findById(id);
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        const cleaner = order.cleaners.find(c => c.user == user);
        if (!cleaner || !cleaner.leader) {
            throw new service_error_1.UnauthorizedException("Only Assigned team lead can start or commerce cleaning");
        }
        if ((0, helpers_1.isEmpty)(order.started_at)) {
            throw new service_error_1.UnauthorizedException("Order hasn't started");
        }
        const actual_duration = (0, dayjs_1.default)().diff((0, dayjs_1.default)(order.started_at), "hours");
        if (actual_duration < order.estimated_duration) {
            throw new service_error_1.UnauthorizedException("You can't end this order till it's exceeds the estimated duration");
        }
        const data = await order_1.default.findByIdAndUpdate(id, { ended_at: (0, dayjs_1.default)().toISOString(), actual_duration, status: "ended" }, { new: true });
        return { message: "Order ended successfully", data };
    }
    async accept(id, user_id) {
        const order = await order_1.default.findById(id);
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        if (!(0, helpers_1.compareStrings)(order.status, "pending")) {
            throw new service_error_1.BadRequestException(`This order has been ${order.status}`);
        }
        if (order.cleaners.some(c => c.user === user_id)) {
            throw new service_error_1.BadRequestException(`You've already accepted this order`);
        }
        if (order.cleaners.length >= order.num_cleaners) {
            throw new service_error_1.BadRequestException(`This order has exceded the maximum number of cleaners`);
        }
        const user = await user_1.default.findById(user_id);
        if (!user)
            throw new service_error_1.NotFoundException("User not found");
        if ((0, helpers_1.isEmpty)(user.cleaner))
            throw new service_error_1.NotFoundException("User is not a registered cleaner");
        const ids = order.cleaners.map(c => c.user.toString());
        ids.push(user_id);
        const cleaners = await cleaner_1.default.find({ user: ids }).populate("user", "first_name last_name avatar");
        let data = [];
        if (cleaners.length > 0) {
            data = this.selectLeader(cleaners);
            console.log(data);
            await order.updateOne({ cleaners: data });
        }
        return { message: "Order accepted successfully", data: null };
    }
    async decline(id, user) {
        const order = await order_1.default.findById(id);
        if (!order)
            throw new service_error_1.NotFoundException("Order not found");
        if (!(0, helpers_1.compareStrings)(order.status, "pending")) {
            //TODO: charge the user if the order is no longer pending and he has once accepted the order
            // throw new BadRequestException(`This order has been ${order.status}`)
        }
        if (!order.cleaners.some(c => c.user === user)) {
            throw new service_error_1.BadRequestException(`You've not accepted this order`);
        }
        await order.updateOne({ $unset: { cleaners: { user } } });
        return { message: "Order declined successfully", data: null };
    }
    async requestKit(payload, user) {
        const cleaner = await cleaner_1.default.findOne({ user });
        if (!cleaner)
            throw new service_error_1.NotFoundException("Cleaner not found");
        if (!cleaner.isverified()) {
            throw new service_error_1.NotFoundException("Cleaner's kyc hasn't being verified, try again later");
        }
        // const req = await Request.findOne({ user })
        // if(req || req.balance)
        const data = await request_1.default.create({
            user,
            phone_number: payload.phone_number,
            location: {
                house_num: payload === null || payload === void 0 ? void 0 : payload.house_num,
                address: payload === null || payload === void 0 ? void 0 : payload.address,
                city: payload === null || payload === void 0 ? void 0 : payload.city,
                state: payload.state,
                postal_code: payload.postal_code
            }
        });
        return { message: "Request recieved successfully", data: null };
    }
    paymentMethod() { }
    async profile(user) {
        const data = await cleaner_1.default.findOne({ user }).select("-docs").populate("user", "-password");
        return {
            message: "Cleaner's profile retrieved successfully",
            data
        };
    }
    async getCleaners(query) {
        const filters = this.filters(query);
        // TODO: ensure to only return verified cleaners 
        const data = await cleaner_1.default.find({
            $and: filters.length > 0 ? filters : [{}]
        }).populate("user", "-password").select("-docs");
        return {
            message: "Cleaners retrieved successfully",
            data: data === null || data === void 0 ? void 0 : data.filter(i => !(0, helpers_1.isEmpty)(i.user))
        };
    }
    async uploadDocs(payload, user) {
        try {
            const { image, type } = payload;
            const cleaner = await cleaner_1.default.findOne({ user });
            if (!cleaner)
                throw new service_error_1.NotFoundException("Cleaner not found");
            const result = await cloudinary_1.default.uploader.upload(image, { folder: '/docs' });
            if (!result)
                throw new service_error_1.BadRequestException("Couldn't upload docs, please try again");
            const doc = cleaner.docs.find(d => (0, helpers_1.compareStrings)(d.type, type));
            if (!doc) {
                cleaner.docs.push({ type, url: result.secure_url });
            }
            else
                doc.url = result.secure_url;
            await cleaner.save();
            return { message: "Upload successful", data: cleaner.docs };
        }
        catch (error) {
            throw new service_error_1.BadRequestException("Couldn't upload docs, please try again");
        }
    }
    async kycStatus(user) {
        const cleaner = await cleaner_1.default.findOne({ user });
        if (!cleaner)
            throw new service_error_1.NotFoundException("Cleaner not found");
        return {
            message: "Cleaner's KYC Status retrieved successfully",
            data: cleaner.docs
        };
    }
    async setLocation(payload, user) {
        const cleaner = await cleaner_1.default.findOne({ user });
        if (!cleaner)
            throw new service_error_1.NotFoundException("Cleaner not found");
        await cleaner.updateOne({
            location: {
                coordinates: [payload.lat, payload.long]
            }
        });
        return { message: "Location set successfully", data: null };
    }
    filters(payload) {
        const allowed_filters = ["lat"];
        const queries = [];
        const _filters = Object.entries(payload);
        for (let i = 0; i < _filters.length; i++) {
            if (!allowed_filters.includes(_filters[i][0]))
                continue;
            if ((0, helpers_1.compareStrings)(_filters[i][0], "lat")) {
                queries.push({
                    location: { $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates: [payload === null || payload === void 0 ? void 0 : payload.long, payload === null || payload === void 0 ? void 0 : payload.lat]
                            },
                            spherical: true,
                            distanceField: 'distance',
                            $maxDistance: 5000 // Distance in meters
                        } }
                });
            }
            else
                queries.push({ [_filters[i][0]]: { $regex: new RegExp(`${_filters[i][1]}`), $options: "i" } });
        }
        return queries;
    }
    selectLeader(users) {
        let highest = -Infinity;
        let leader = null;
        users.forEach(user => {
            if (user.avg_rating > highest) {
                highest = user.avg_rating;
                leader = user.user;
            }
        });
        return users.map(user => {
            var _a, _b, _c, _d;
            return ({
                name: ((_a = user.user) === null || _a === void 0 ? void 0 : _a.first_name) + " " + ((_b = user.user) === null || _b === void 0 ? void 0 : _b.last_name),
                avatar: ((_c = user.user) === null || _c === void 0 ? void 0 : _c.avatar) || null,
                user: (_d = user.user) === null || _d === void 0 ? void 0 : _d._id,
                leader: user.user == leader
            });
        });
    }
}
exports.default = new Service();
//# sourceMappingURL=service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = __importDefault(require("../../model/transaction"));
const service_error_1 = require("../../utility/service-error");
const order_1 = __importDefault(require("../../model/order"));
const helpers_1 = require("../../utility/helpers");
const numeral_1 = __importDefault(require("numeral"));
const user_1 = __importDefault(require("../../model/user"));
class Controller {
    async paypal(req, res, next) {
        var _a;
        try {
            const { resource } = req.body;
            const unit = resource.purchase_units.find(u => (0, helpers_1.compareStrings)(u === null || u === void 0 ? void 0 : u.reference_id, "default"));
            if (unit.custom_id.startsWith("WAL-")) {
                const tx = await transaction_1.default.findOne({ payment_ref: resource === null || resource === void 0 ? void 0 : resource.id });
                if (!tx || (tx === null || tx === void 0 ? void 0 : tx.status) !== "pending") {
                    throw new service_error_1.BadRequestException("Bad request");
                }
                if ((0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.status, "APPROVED")) {
                    tx.status = "successful";
                    await user_1.default.updateOne({ _id: tx.user }, { $inc: { balance: (0, numeral_1.default)((_a = unit === null || unit === void 0 ? void 0 : unit.amount) === null || _a === void 0 ? void 0 : _a.value).value() } });
                    await tx.save();
                }
            }
            if (unit.custom_id.startsWith("ORD-")) {
                const order = await order_1.default.findOne({ payment_ref: resource === null || resource === void 0 ? void 0 : resource.id });
                if (!order)
                    throw new service_error_1.NotFoundException("Order not found");
                if ((0, helpers_1.compareStrings)(resource === null || resource === void 0 ? void 0 : resource.status, "APPROVED")) {
                    order.paid = true;
                    await order.save();
                }
            }
            return res.status(200);
        }
        catch (error) {
            return res.status(200);
        }
        // return console.log(JSON.stringify(req.body, null, 2))
        // const { status, resources } = req.params
        // let tx: any = null
        // let order: any = null
        // let sub: any = null
        // let amount = 0
        // const filter = {
        //   "metadata": { payment: req.query?.paymentId },
        //   // payment_method: "paypal"
        // }
        // console.log(filter)
        // if(compareStrings(resources, "wallet")){
        //   tx = await Transaction.findOne(filter)
        //   if(!tx) throw new NotFoundException("Transaction not found");
        //   amount = tx.amount;
        // }
        // else if(compareStrings(resources, "order")){
        //   order = await Order.findOne(filter)
        //   if(!order) throw new NotFoundException("Order not found");
        //   amount = order.amount;
        // }
        // else if(compareStrings(resources, "subscription")){
        //   sub = await Subscription.findOne(filter)
        //   if(!sub) throw new NotFoundException("Subcription not found");
        //   amount = sub.amount;
        // }
        // else {
        //   throw new NotFoundException("Resource not found/supported")
        // }
        // if(compareStrings(status, "failed")){
        //   //TODO: handled failed payment
        //   return;
        // }
        // if(compareStrings(resources, "subscription")){
        //   console.log("Query: ",req.query)
        //   return executeSubscription(req.query?.token, async (err, result) => {
        //     if(err) throw new ServiceError(err.message, err.httpStatusCode, err.response.details);
        //     console.log("Result: ", result)
        //     if(!compareStrings(result.state, "Active") || isEmpty(sub)) {
        //       throw new ServiceError(
        //         result?.failure_reason || "Payment not approved", 
        //         result.httpStatusCode, 
        //       );
        //     }
        //     sub.status = "active"
        //     await sub.save()
        //     return responsHandler(res, "Subscripton payment completed", StatusCodes.OK, result)
        //     //TODO: check for failed subscription
        //   })
        // }
        // return executePayment(
        //   amount, 
        //   req.query?.PayerID, 
        //   req.query.paymentId,
        //   async (err, result) => {
        //     if(err) throw new ServiceError(err.message, err.httpStatusCode, err.response.details);
        //     else {
        //       JSON.stringify(result, null, 2)
        //       if(result.state !== "approved") {
        //         throw new ServiceError(
        //           result?.failure_reason || "Payment not approved", 
        //           result.httpStatusCode, 
        //         );
        //       }
        //       if(!isEmpty(tx)){
        //         tx.status = "successful"
        //         const user = await User.findById(tx.user)
        //         if(!user) throw new NotFoundException("User not found")
        //         user.balance = numeral(user.balance).add(tx.amount).value()
        //         await user.save()
        //         await tx.save()
        //         return responsHandler(res, "Payment completed", StatusCodes.OK, result)
        //       }
        //       else if(!isEmpty(order)){
        //         order.paid = true
        //         await order.save()
        //         return responsHandler(res, "Payment completed", StatusCodes.OK, result)
        //       }
        //     }
        //   }
        // )
    }
}
exports.default = new Controller();
//# sourceMappingURL=controller.js.map
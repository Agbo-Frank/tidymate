"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSubscription = void 0;
const _1 = __importDefault(require("."));
function executeSubscription(token, cb) {
    return _1.default.billingAgreement.execute(token, {}, function (error, payment) {
        if (error)
            return cb(error, null);
        else
            return cb(null, payment);
    });
}
exports.executeSubscription = executeSubscription;
//# sourceMappingURL=execute-subscription.js.map
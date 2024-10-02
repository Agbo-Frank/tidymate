"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const jsonwebtoken_1 = require("jsonwebtoken");
const service_error_1 = require("./service-error");
class JWT {
    create(payload, options = {}) {
        return (0, jsonwebtoken_1.sign)(payload, String(config_1.JWT_SECRET_KEY), {
            expiresIn: '360h',
            audience: 'API',
            issuer: 'Tidymates',
            ...options
        });
    }
    verify(token) {
        var _a;
        try {
            return (0, jsonwebtoken_1.verify)(token, config_1.JWT_SECRET_KEY);
        }
        catch (error) {
            throw new service_error_1.UnauthorizedException(((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.replace("jwt", "token")) || "Session expired");
        }
    }
}
exports.default = new JWT();
//# sourceMappingURL=jwt.js.map
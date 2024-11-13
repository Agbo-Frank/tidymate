"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const service_error_1 = require("../../utility/service-error");
const history_1 = __importDefault(require("../../model/history"));
const config_1 = require("../../utility/config");
const helpers_1 = require("../../utility/helpers");
class Service {
    async getDirection(payload) {
        try {
            const params = new URLSearchParams();
            params.append("key", config_1.GOOGLE_API_KEY);
            Object.entries(payload).forEach(v => {
                if (typeof v[1] === "string") {
                    params.append(v[0], v[1]);
                }
                if (Array.isArray(v[1])) {
                    params.append(v[0], v[1].join(","));
                }
            });
            const { data } = await axios_1.default.get(`https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`);
            if (!(0, helpers_1.compareStrings)("OK", data === null || data === void 0 ? void 0 : data.status)) {
                throw new service_error_1.BadRequestException((data === null || data === void 0 ? void 0 : data.error_message) || "Unable to get direction");
            }
            return { data, message: "direction fetched successfully" };
        }
        catch (error) {
            if (error instanceof service_error_1.ServiceError) {
                throw error;
            }
            throw new service_error_1.BadRequestException("Unable to get direction");
        }
    }
    async locationSearch(payload) {
        const _payload = { textQuery: payload === null || payload === void 0 ? void 0 : payload.search };
        if ("location" in payload) {
            const [latitude, longitude] = payload.location;
            _payload.locationBias = {
                "circle": {
                    "center": { longitude, latitude },
                    "radius": 500.0
                }
            };
        }
        try {
            const { data } = await axios_1.default.post("https://places.googleapis.com/v1/places:searchText", _payload, {
                headers: {
                    "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.primaryType",
                    "X-Goog-Api-Key": config_1.GOOGLE_API_KEY
                }
            });
            return {
                data: data === null || data === void 0 ? void 0 : data.places.map(p => { var _a; return ({ ...p, name: (_a = p === null || p === void 0 ? void 0 : p.displayName) === null || _a === void 0 ? void 0 : _a.text, type: p === null || p === void 0 ? void 0 : p.primaryType, address: p === null || p === void 0 ? void 0 : p.formattedAddress }); }),
                message: "Location search successful"
            };
        }
        catch (error) {
            throw new service_error_1.BadRequestException("Location search unsuccessful");
        }
    }
    async autoCompleteSearch(payload) {
        const _payload = { input: payload === null || payload === void 0 ? void 0 : payload.search };
        if ("coordinates" in payload) {
            const [latitude, longitude] = payload.coordinates;
            _payload.locationBias = {
                "circle": {
                    "center": { longitude, latitude },
                    "radius": 500.0
                }
            };
        }
        try {
            const { data } = await axios_1.default.post("https://places.googleapis.com/v1/places:autocomplete", _payload, { headers: { "X-Goog-Api-Key": config_1.GOOGLE_API_KEY } });
            return {
                data: data === null || data === void 0 ? void 0 : data.suggestions.map(p => p === null || p === void 0 ? void 0 : p.placePrediction),
                message: "Location search successful"
            };
        }
        catch (error) {
            console.log(error);
            throw new service_error_1.BadRequestException("Location search unsuccessful");
        }
    }
    async history(user) {
        const data = await history_1.default.find({ user });
        return { data, message: "location history retrieved" };
    }
}
exports.default = new Service();
//# sourceMappingURL=service.js.map
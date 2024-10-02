"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const service_error_1 = require("../../utility/service-error");
const history_1 = __importDefault(require("../../model/history"));
class Service {
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
                    "X-Goog-Api-Key": "AIzaSyDFaorQOBfhVVUl1xsHzvimciVJxvj2H5g"
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
            const { data } = await axios_1.default.post("https://places.googleapis.com/v1/places:autocomplete", _payload, { headers: { "X-Goog-Api-Key": "AIzaSyDFaorQOBfhVVUl1xsHzvimciVJxvj2H5g" } });
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
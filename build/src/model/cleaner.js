"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const numeral_1 = __importDefault(require("numeral"));
const cleaner = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User"
    },
    code: String,
    available: {
        type: Boolean,
        default: true
    },
    earnings: { type: Number, default: 0 },
    completed_order: { type: Number, default: 0 },
    rating: {
        num_of_rating: { type: Number, default: 0 },
        value_of_rating: { type: Number, default: 0 }
    },
    location: {
        type: { type: String, default: "Point" },
        coordinates: [Number]
    },
    docs: [{
            type: {
                type: String,
                enum: ["proof_of_work", "profile", "gov_id", "back_check"]
            },
            url: String,
            verified: { type: Boolean, default: false }
        }],
    verified: { type: Boolean, default: false }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
    methods: {
        isverified() {
            return this.docs.length > 4 && this.docs.every(d => d.verified);
        }
    },
    virtuals: {
        avg_rating: {
            get() {
                return (0, numeral_1.default)(this.rating.value_of_rating).divide(this.rating.num_of_rating).value() || 0;
            }
        }
    },
    toJSON: { virtuals: true }
});
cleaner.index({ location: '2dsphere' });
const Cleaner = (0, mongoose_1.model)("cleaner", cleaner);
exports.default = Cleaner;
//# sourceMappingURL=cleaner.js.map
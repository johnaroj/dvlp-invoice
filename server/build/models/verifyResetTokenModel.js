"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const verifyResetTokenSchema = new Schema({
    _userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 900,
    },
});
const VerifyResetToken = mongoose_1.default.model("VerifyResetToken", verifyResetTokenSchema);
exports.default = VerifyResetToken;
//# sourceMappingURL=verifyResetTokenModel.js.map
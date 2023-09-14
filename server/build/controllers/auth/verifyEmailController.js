"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_js_1 = __importDefault(require("../../models/userModel.js"));
const verifyResetTokenModel_js_1 = __importDefault(require("../../models/verifyResetTokenModel.js"));
const sendEmail_js_1 = __importDefault(require("../../utils/sendEmail.js"));
const domainUrl = process.env.DOMAIN_URL;
// $-title Verify user email
// $-path GET /api/v1/auth/verify/:emailToken/:userId
// $-auth Public
const verifyUserEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_js_1.default.findOne({ _id: req.params.userId }).select("-passwordConfirm");
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (user.isEmailVerified) {
        res.status(400).send("User already verified. Please login");
    }
    const userToken = yield verifyResetTokenModel_js_1.default.findOne({
        user: user._id,
        token: req.params.emailToken,
    });
    if (!userToken) {
        res.status(400);
        throw new Error("Invalid token! Token may have expired");
    }
    user.isEmailVerified = true;
    yield user.save();
    if (user.isEmailVerified) {
        const emailLink = `${domainUrl}/login`;
        const payload = {
            name: user.firstName,
            link: emailLink,
        };
        yield (0, sendEmail_js_1.default)(user.email, "Welcome - Account Verified", payload, "./emails/template/welcome.handlebars");
        res.redirect(`/auth/verify`);
    }
}));
exports.default = verifyUserEmail;

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
const crypto_1 = require("crypto");
const domainUrl = process.env.DOMAIN_URL;
// $-title Register User and send email verification link
// $-path POST /api/v1/auth/register
// $-auth public
const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, firstName, lastName, password, passwordConfirm } = req.body;
    if (!email) {
        res.status(400);
        throw new Error("Email is required");
    }
    if (!username) {
        res.status(400);
        throw new Error("Username is required");
    }
    if (!firstName || !lastName) {
        res.status(400);
        throw new Error("First Name and Last Name is required");
    }
    if (!password) {
        res.status(400);
        throw new Error("Password is required");
    }
    if (!passwordConfirm) {
        res.status(400);
        throw new Error("Password confirm is required");
    }
    const userExists = yield userModel_js_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("The email adress already exists");
    }
    const newUser = yield userModel_js_1.default.create({
        email,
        username,
        firstName,
        lastName,
        password,
        passwordConfirm,
    });
    const registeredUser = yield newUser.save();
    if (!registeredUser) {
        res.status(400);
        throw new Error("User could not be registered");
    }
    if (registeredUser) {
        const verificationToken = (0, crypto_1.randomBytes)(32).toString("hex");
        let emailVerificationToken = yield new verifyResetTokenModel_js_1.default({
            _userId: registeredUser._id,
            token: verificationToken,
        }).save();
        const emailLink = `${domainUrl}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;
        const payload = {
            name: registeredUser.firstName,
            link: emailLink,
        };
        yield (0, sendEmail_js_1.default)(registeredUser.email, "Verify your email", payload, "./emails/template/accountVerification.handlebars");
        res.json({
            success: true,
            message: `A new user ${registeredUser.firstName} has been registerd!. A verification email has been sent to your account. Please verify your email within 15 minutes to complete the registration process.`,
        });
    }
}));
exports.default = registerUser;

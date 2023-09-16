"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const verifyResetTokenModel_1 = __importDefault(require("../../models/verifyResetTokenModel"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const domainUrl = process.env.DOMAIN_URL;
// $-title Verify user email
// $-path GET /api/v1/auth/verify/:emailToken/:userId
// $-auth Public
const verifyUserEmail = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findOne({ _id: req.params.userId }).select("-passwordConfirm");
    console.log(req.params.emailToken);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (user.isEmailVerified) {
        res.status(400).send("User already verified. Please login");
    }
    const userToken = await verifyResetTokenModel_1.default.findOne({
        _userId: user._id,
        token: req.params.emailToken,
    });
    if (!userToken) {
        res.status(400);
        throw new Error("Invalid token! Token may have expired");
    }
    user.isEmailVerified = true;
    await user.save();
    if (user.isEmailVerified) {
        const emailLink = `${domainUrl}/login`;
        const payload = {
            name: user.firstName,
            link: emailLink,
        };
        await (0, sendEmail_1.default)(user.email, "Welcome - Account Verified", payload, "./emails/template/welcome.handlebars");
        res.redirect(`/auth/verify`);
    }
});
exports.default = verifyUserEmail;
//# sourceMappingURL=verifyEmailController.js.map
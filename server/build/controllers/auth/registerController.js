"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const domainUrl = process.env.DOMAIN_URL;
// $-title Register User and send email verification link
// $-path POST /api/v1/auth/register
// $-auth public
const registerUser = (0, express_async_handler_1.default)(async (req, res) => {
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
    try {
        const userExists = await userModel_1.default.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("The email adress already exists");
        }
    }
    catch (error) {
        console.log(error);
    }
    // const newUser = await User.create({
    //   email,
    //   username,
    //   firstName,
    //   lastName,
    //   password,
    //   passwordConfirm,
    // });
    // const registeredUser = await newUser.save();
    // if (!registeredUser) {
    //   res.status(400);
    //   throw new Error("User could not be registered");
    // }
    // if (registeredUser) {
    //   const verificationToken = randomBytes(32).toString("hex");
    //   let emailVerificationToken = await new VerificationToken({
    //     _userId: registeredUser._id,
    //     token: verificationToken,
    //   }).save();
    //   const emailLink = `${domainUrl}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;
    //   const payload = {
    //     name: registeredUser.firstName,
    //     link: emailLink,
    //   };
    //   await sendEmail(
    //     registeredUser.email,
    //     "Verify your email",
    //     payload,
    //     "./emails/template/accountVerification.handlebars"
    //   );
    //   res.json({
    //     success: true,
    //     message: `A new user ${registeredUser.firstName} has been registerd!. A verification email has been sent to your account. Please verify your email within 15 minutes to complete the registration process.`,
    //   });
    // }
});
exports.default = registerUser;
//# sourceMappingURL=registerController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const Logger_1 = require("../../utils/Logger");
// $-title Login User and send access token
// $-path POST /api/v1/auth/login
// $-auth public
const loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }
    const existingUser = await userModel_1.default.findOne({ email }).select("+password");
    const isPasswordCorrect = await (existingUser === null || existingUser === void 0 ? void 0 : existingUser.comparePassword(password));
    if (!existingUser || !isPasswordCorrect) {
        res.status(401);
        Logger_1.systemLogger.error("Invalid credentials");
        throw new Error("Invalid credentials");
    }
    if (!existingUser.isEmailVerified) {
        res.status(401);
        //systemLogger.error("Email not verified");
        throw new Error("Email not verified");
    }
    if (!existingUser.active) {
        res.status(400);
        //systemLogger.error("Account is not active");
        throw new Error("Account is not active. Contact us for enquiries");
    }
    if (existingUser || isPasswordCorrect) {
        const accessToken = jsonwebtoken_1.default.sign({
            id: existingUser._id,
            roles: existingUser.roles,
        }, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: existingUser._id,
        }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "1d" });
        const cookies = req.cookies;
        let newRefreshTokenArray = !(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)
            ? existingUser.refreshToken
            : existingUser.refreshToken.filter((refreshToken) => refreshToken !== cookies.jwt);
        if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt) {
            const refreshToken = cookies.jwt;
            const existingRefreshToken = await userModel_1.default.findOne({ refreshToken }).exec();
            if (!existingRefreshToken) {
                newRefreshTokenArray = [];
            }
            const options = {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            };
            res.clearCookie("jwt", options);
        }
        existingUser.refreshToken = [...newRefreshTokenArray, refreshToken];
        await existingUser.save();
        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "none",
        };
        res.cookie("jwt", refreshToken, options);
        res.json({
            success: true,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            username: existingUser.username,
            provider: existingUser.provider,
            avatar: existingUser.avatar,
            accessToken,
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid credentials provided");
    }
});
exports.default = loginUser;
//# sourceMappingURL=loginController.js.map
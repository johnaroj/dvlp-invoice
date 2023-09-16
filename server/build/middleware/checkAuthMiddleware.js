"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const checkAuth = (0, express_async_handler_1.default)(async (req, res, next) => {
    let jwt_token;
    //Bearer
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        jwt_token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(jwt_token, process.env.JWT_ACCESS_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.sendStatus(401);
            }
            const userId = decoded.id;
            req.user = await userModel_1.default.findById(userId).select("-password");
            req.roles = decoded.roles;
            next();
        });
    }
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer"))) {
        res.sendStatus(401);
    }
});
exports.default = checkAuth;
//# sourceMappingURL=checkAuthMiddleware.js.map
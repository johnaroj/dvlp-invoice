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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const checkAuth = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let jwt_token;
    //Bearer
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        jwt_token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(jwt_token, process.env.JWT_ACCESS_SECRET_KEY, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.sendStatus(401);
            }
            const userId = decoded.id;
            req.user = yield userModel_js_1.default.findById(userId).select("-password");
            req.roles = decoded.roles;
            next();
        }));
    }
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer"))) {
        res.sendStatus(401);
    }
}));
exports.default = checkAuth;

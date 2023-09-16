"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const Logger_1 = require("../utils/Logger");
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests from this IP, please try again in 15 minutes",
    },
    handler: (req, res, next, options) => {
        Logger_1.systemLogger.error(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many login attempts from this IP, please try again in 30 minutes",
    },
    handler: (req, res, next, options) => {
        Logger_1.systemLogger.error(`Too many requests: ${options.message.message}\t${req.url}\t${req.method}\t${req.headers.origin}`);
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=apiLimiter.js.map
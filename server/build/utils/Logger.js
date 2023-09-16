"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.systemLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, prettyPrint } = winston_1.format;
const fileRotateTransport = new winston_1.transports.DailyRotateFile({
    filename: "logs/combined-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "14d",
});
exports.systemLogger = (0, winston_1.createLogger)({
    level: "http",
    format: combine(timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS A",
    }), prettyPrint()),
    transports: [
        fileRotateTransport,
        new winston_1.transports.File({
            level: "error",
            filename: "logs/error.log",
        }),
    ],
    exceptionHandlers: [new winston_1.transports.File({ filename: "logs/exceptions.log" })],
    rejectionHandlers: [new winston_1.transports.File({ filename: "logs/rejections.log" })],
});
exports.morganMiddleware = (0, morgan_1.default)(function (tokens, req, res) {
    return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: Number.parseFloat(tokens.status(req, res) || ""),
        content_length: tokens.res(req, res, "content-length"),
        response_time: Number.parseFloat(tokens["response-time"](req, res) || ""),
    });
}, {
    stream: {
        write: function (message) {
            const data = JSON.parse(message);
            exports.systemLogger.http(`incoming request`, data);
        },
    },
});
//# sourceMappingURL=Logger.js.map
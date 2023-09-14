"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter;
if (process.env.NODE_ENV === "development") {
    transporter = nodemailer_1.default.createTransport({
        host: "mailhog",
        port: 1025,
    });
}
else if (process.env.NODE_ENV === "production") {
    transporter = nodemailer_1.default.createTransport({});
}
exports.default = transporter;

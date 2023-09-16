"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
const mailTransport_1 = __importDefault(require("../helpers/mailTransport"));
const Logger_1 = require("./Logger");
const sendEmail = async (email, subject, payload, template) => {
    try {
        const sourceDirectory = fs_1.default.readFileSync(path_1.default.join(__dirname, template), "utf-8");
        const compiledTemplate = handlebars_1.default.compile(sourceDirectory);
        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        };
        await mailTransport_1.default.sendMail(emailOptions);
    }
    catch (error) {
        Logger_1.systemLogger.error(`email not sent: ${error}`);
    }
};
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map
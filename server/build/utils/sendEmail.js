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
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
const mailTransport_js_1 = __importDefault(require("../helpers/mailTransport.js"));
const Logger_js_1 = require("./Logger.js");
const sendEmail = (email, subject, payload, template) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sourceDirectory = fs_1.default.readFileSync(path_1.default.join(process.cwd(), template), "utf-8");
        const compiledTemplate = handlebars_1.default.compile(sourceDirectory);
        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        };
        yield mailTransport_js_1.default.sendMail(emailOptions);
    }
    catch (error) {
        Logger_js_1.systemLogger.error(`email not sent: ${error}`);
    }
});
exports.default = sendEmail;

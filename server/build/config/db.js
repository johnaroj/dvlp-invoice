"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const Logger_1 = require("../utils/Logger");
const db = async () => {
    try {
        const connectionParams = {
            dbName: process.env.DB_NAME,
        };
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI, connectionParams);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        Logger_1.systemLogger.info(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error}`);
        Logger_1.systemLogger.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
exports.default = db;
//# sourceMappingURL=db.js.map
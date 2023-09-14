import "dotenv/config";
import mongoose from "mongoose";
import { systemLogger } from "../utils/Logger";

const chalk = import("chalk").then((m) => m.default);

console.log(process.env.MONGO_URI);
const db = async () => {
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };
    const conn = await mongoose.connect(
      process.env.MONGO_URI!,
      connectionParams
    );
    console.log(
      (await chalk).blue.bold(`MongoDB Connected: ${conn.connection.host}`)
    );
    systemLogger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error((await chalk).red.bold(`Error: ${error.message}`));
    systemLogger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default db;

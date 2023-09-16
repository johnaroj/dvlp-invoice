import "dotenv/config";
import mongoose from "mongoose";
import { systemLogger } from "../utils/Logger";

const db = async () => {
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };
    const conn = await mongoose.connect(
      process.env.MONGO_URI!,
      connectionParams
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    systemLogger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error}`);
    systemLogger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default db;

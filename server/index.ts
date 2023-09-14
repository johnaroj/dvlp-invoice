import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { morganMiddleware, systemLogger } from "./utils/Logger";
import mongoSantize from "express-mongo-sanitize";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import db from "./config/db.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSantize());
app.use(morganMiddleware);

app.get("/api/v1/test", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 1997;

app.listen(PORT, () => {
  console.log(
    `✓ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  systemLogger.info(
    `✓ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { morganMiddleware, systemLogger } from "./utils/Logger";
import mongoSantize from "express-mongo-sanitize";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import db from "./config/db";
import { apiLimiter } from "./middleware/apiLimiter";

(async () => await db())();
const app = express();
app.set("trust proxy", 1);

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
app.use("/api/v1/user", apiLimiter, userRoutes);

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

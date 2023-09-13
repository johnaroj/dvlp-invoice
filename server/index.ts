import cookieParser from "cookie-parser";
import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import { morganMiddleware, systemLogger } from "./utils/Logger";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morganMiddleware);

app.get("/api/v1/test", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

const PORT = process.env.PORT || 1997;

app.listen(PORT, () => {
  console.log(
    `✓ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  systemLogger.info(
    `✓ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

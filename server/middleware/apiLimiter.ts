import rateLimit, { Options } from "express-rate-limit";
import { systemLogger } from "../utils/Logger";
import { NextFunction, Request, Response } from "express";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message: "Too many requests from this IP, please try again in 15 minutes",
  },
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    systemLogger.error(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    message:
      "Too many login attempts from this IP, please try again in 30 minutes",
  },
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    systemLogger.error(
      `Too many requests: ${options.message.message}\t${req.url}\t${req.method}\t${req.headers.origin}`
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

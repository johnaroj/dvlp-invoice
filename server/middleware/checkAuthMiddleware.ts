import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";

interface IRequest extends Request {
  [key: string]: any;
}

const checkAuth = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let jwt_token: any;
    //Bearer

    const authHeader =
      req.headers.authorization || (req.headers.Authorization as string);

    if (authHeader && authHeader.startsWith("Bearer")) {
      jwt_token = authHeader.split(" ")[1];
      jwt.verify(
        jwt_token,
        process.env.JWT_ACCESS_SECRET_KEY as string,
        async (err: any, decoded: any) => {
          if (err) {
            return res.sendStatus(401);
          }
          const userId = decoded.id;
          req.user = await User.findById(userId).select("-password");
          req.roles = decoded.roles;
          next();
        }
      );
    }
    if (!authHeader?.startsWith("Bearer")) {
      res.sendStatus(401);
    }
  }
);

export default checkAuth;

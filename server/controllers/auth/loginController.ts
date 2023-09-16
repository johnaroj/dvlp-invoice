import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/userModel";
import { CookieOptions, Request, Response } from "express";
import { systemLogger } from "../../utils/Logger";

// $-title Login User and send access token
// $-path POST /api/v1/auth/login
// $-auth public

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const existingUser = await User.findOne({ email }).select("+password");

  const isPasswordCorrect = await existingUser?.comparePassword(password);

  if (!existingUser || !isPasswordCorrect) {
    res.status(401);
    systemLogger.error("Invalid credentials");
    throw new Error("Invalid credentials");
  }

  if (!existingUser.isEmailVerified) {
    res.status(401);
    //systemLogger.error("Email not verified");
    throw new Error("Email not verified");
  }

  if (!existingUser.active) {
    res.status(400);
    //systemLogger.error("Account is not active");
    throw new Error("Account is not active. Contact us for enquiries");
  }

  if (existingUser || isPasswordCorrect) {
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        roles: existingUser.roles,
      },
      process.env.JWT_ACCESS_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_REFRESH_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    const cookies = req.cookies;

    let newRefreshTokenArray = !cookies?.jwt
      ? existingUser.refreshToken
      : existingUser.refreshToken.filter(
          (refreshToken: any) => refreshToken !== cookies.jwt
        );
    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const existingRefreshToken = await User.findOne({ refreshToken }).exec();

      if (!existingRefreshToken) {
        newRefreshTokenArray = [];
      }

      const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
      } as CookieOptions;

      res.clearCookie("jwt", options);
    }

    existingUser.refreshToken = [...newRefreshTokenArray, refreshToken];
    await existingUser.save();

    const options = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    } as CookieOptions;

    res.cookie("jwt", refreshToken, options);
    res.json({
      success: true,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      username: existingUser.username,
      provider: existingUser.provider,
      avatar: existingUser.avatar,
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials provided");
  }
});

export default loginUser;

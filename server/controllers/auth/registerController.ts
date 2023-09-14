import asyncHandler from "express-async-handler";
import User from "../../models/userModel";
import VerificationToken from "../../models/verifyResetTokenModel";
import sendEmail from "../../utils/sendEmail";
import { randomBytes } from "crypto";
import { Request, Response } from "express";

const domainUrl = process.env.DOMAIN_URL;

// $-title Register User and send email verification link
// $-path POST /api/v1/auth/register
// $-auth public

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, firstName, lastName, password, passwordConfirm } =
    req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (!username) {
    res.status(400);
    throw new Error("Username is required");
  }

  if (!firstName || !lastName) {
    res.status(400);
    throw new Error("First Name and Last Name is required");
  }

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  if (!passwordConfirm) {
    res.status(400);
    throw new Error("Password confirm is required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("The email adress already exists");
  }

  const newUser = await User.create({
    email,
    username,
    firstName,
    lastName,
    password,
    passwordConfirm,
  });

  const registeredUser = await newUser.save();

  if (!registeredUser) {
    res.status(400);
    throw new Error("User could not be registered");
  }

  if (registeredUser) {
    const verificationToken = randomBytes(32).toString("hex");
    let emailVerificationToken = await new VerificationToken({
      _userId: registeredUser._id,
      token: verificationToken,
    }).save();
    const emailLink = `${domainUrl}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;
    const payload = {
      name: registeredUser.firstName,
      link: emailLink,
    };
    await sendEmail(
      registeredUser.email,
      "Verify your email",
      payload,
      "./emails/template/accountVerification.handlebars"
    );

    res.json({
      success: true,
      message: `A new user ${registeredUser.firstName} has been registerd!. A verification email has been sent to your account. Please verify your email within 15 minutes to complete the registration process.`,
    });
  }
});

export default registerUser;

import asyncHandler from "express-async-handler";
import User from "../../models/userModel";
import VerificationToken from "../../models/verifyResetTokenModel";
import sendEmail from "../../utils/sendEmail";
import { Request, Response } from "express";

const domainUrl = process.env.DOMAIN_URL;

// $-title Verify user email
// $-path GET /api/v1/auth/verify/:emailToken/:userId
// $-auth Public

const verifyUserEmail = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.params.userId }).select(
    "-passwordConfirm"
  );
  console.log(req.params.emailToken);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400).send("User already verified. Please login");
  }

  const userToken = await VerificationToken.findOne({
    _userId: user._id,
    token: req.params.emailToken,
  });

  if (!userToken) {
    res.status(400);
    throw new Error("Invalid token! Token may have expired");
  }
  user.isEmailVerified = true;
  await user.save();

  if (user.isEmailVerified) {
    const emailLink = `${domainUrl}/login`;
    const payload = {
      name: user.firstName,
      link: emailLink,
    };
    await sendEmail(
      user.email,
      "Welcome - Account Verified",
      payload,
      "./emails/template/welcome.handlebars"
    );
    res.redirect(`/auth/verify`);
  }
});

export default verifyUserEmail;

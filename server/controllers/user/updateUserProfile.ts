import asyncHanlder from "express-async-handler";
import User from "../../models/userModel";
import { Request, Response } from "express";

// $-title Update user profile
// $-path PATCH /api/v1/users/profile
// $-auth Private

const updateUserProfile = asyncHanlder(async (req: any, res: Response) => {
  const userId = req.user._id;

  const {
    password,
    passwordConfirm,
    email,
    isEmailVerified,
    provider,
    roles,
    googleID,
    username,
  } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (password || passwordConfirm) {
    res.status(400);
    throw new Error("You cannot update your password here");
  }

  if (email || isEmailVerified || provider || roles || googleID || username) {
    res.status(400);
    throw new Error(
      "You cannot update your email, isEmailVerified, provider, roles, googleID, or username here"
    );
  }
  const fieldsToUpdate = req.body;

  const updatedProfile = await User.findByIdAndUpdate(
    userId,
    { ...fieldsToUpdate },
    { new: true, runValidators: true }
  ).select("-refreshToken");

  res.status(200).json({
    success: true,
    message: `${updatedProfile.firstName} your profile was successfully updated`,
    updatedProfile,
  });
});

export default updateUserProfile;

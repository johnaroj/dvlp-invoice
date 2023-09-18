import asyncHandler from "express-async-handler";
import User from "../../models/userModel";
import { Request, Response } from "express";

// $-title Delete my account
// $-path DELETE /api/v1/users/profile
// $-auth Private

interface IRequest extends Request {
  user: {
    _id: string;
  };
}

const deleteMyAccount = asyncHandler(async (req: IRequest, res: Response) => {
  const userId = req.user._id;

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "Your account was successfully deleted",
  });
});

export default deleteMyAccount;

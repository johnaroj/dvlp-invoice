import asyncHandler from "express-async-handler";
import User from "../../models/userModel";
import { Request, Response } from "express";

// $-title Delete user account
// $-path DELETE /api/v1/users/:id
// $-auth Private/Admin
// an admin can delete any user account

const deleteUserAccount = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const result = await user.deleteOne();
    res.json({
      success: true,
      message: `User ${result.firstName} deleted successfully`,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default deleteUserAccount;

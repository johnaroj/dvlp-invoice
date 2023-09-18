import asyncHandler from "express-async-handler";
import User from "../../models/userModel";

// $-title Deactivate user account
// $-path DELETE /api/v1/users/:id/deactivate
// $-auth Private/Admin

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.active = false;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default deactivateUser;

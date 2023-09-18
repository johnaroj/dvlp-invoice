import asyncHandler from "express-async-handler";
import User from "../../models/userModel";

// $-title Get all user accounts
// $-path GET /api/v1/users/all
// $-auth Private/Admin

const getAllUserAccount = asyncHandler(async (req: any, res: any) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.countDocuments({});
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .select("-refreshToken")
    .lean();

  res.json({
    success: true,
    count,
    numberOfPages: Math.ceil(count / pageSize),
    users,
  });
});

export default getAllUserAccount;

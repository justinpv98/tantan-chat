import asyncHandler from "express-async-handler";
import UserModel from "@/models/User";
import logger from "@/logger";
import { Request, Response } from "express-serve-static-core";

// @desc    Search users by username
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.query;

  const userQuery = await UserModel.findAll({
    select: ["id", "username", "profile_picture", "status"],
    where: { username: { like: username + "%" } },
  });

  if (!userQuery) {
    res.status(404);
    throw new Error("No users found");
  }

  res.status(200).json(userQuery);
});

export { searchUsers };

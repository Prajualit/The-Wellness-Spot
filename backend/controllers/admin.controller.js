import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-refreshToken -password");

    return res
      .status(200)
      .json(new apiResponse(200, { users }, "Users fetched successfully"));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw new apiError(500, "Failed to fetch users");
  }
});

export { getAllUsers };

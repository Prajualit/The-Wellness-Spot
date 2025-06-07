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

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new apiError(404, "User not found");
    }

    return res.status(200).json(
        new apiResponse(200, null, "User deleted successfully")
    );
});

export { getAllUsers, deleteUser };

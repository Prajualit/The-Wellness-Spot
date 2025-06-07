import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-refreshToken");
    if (!users || users.length === 0) {
        throw new apiError(404, "No users found");
    }
    return apiResponse(res, 200, "Users fetched successfully", { users });
});

export { getAllUsers };
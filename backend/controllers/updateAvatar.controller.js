import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import path from "path";

import { User } from "../models/user.model.js";

const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new apiError(401, "Unauthorized: User not authenticated.");
    }

    console.log(req.body);
    console.log(req.file);
    if (!req.file) {
      throw new apiError(400, "File is required.");
    }

    const fileLocalPath = path.normalize(req.file.path);
    console.log("File local path:", fileLocalPath);

    const uploadedFile = await uploadOnCloudinary(fileLocalPath);
    console.log("Uploaded file response:", uploadedFile);

    if (!uploadedFile || !uploadedFile.url) {
      throw new apiError(500, "File upload failed.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(404, "User not found.");
    }

    // ✅ Direct assignment for a single avatar URL
    user.avatarUrl = uploadedFile.url;

    await user.save();

    console.log("User avatar updated:", user.avatarUrl);

    res.status(200).json(
      new apiResponse(200, {
        message: "Avatar uploaded and user updated successfully.",
        avatarUrl: user.avatarUrl,
      })
    );
  } catch (error) {
    console.error("Error in updateAvatar:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      stack: error.stack,
    });
  }
});

export { updateAvatar };

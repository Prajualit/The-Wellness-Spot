import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import path from "path";

import { User } from "../models/user.model.js";

const updateAvatar = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new apiError(401, "Unauthorized: User not authenticated.");
  }

  const fileLocalPath = path.normalize(req.file?.path);
  if (!fileLocalPath) {
    throw new apiError(400, "File is required.");
  }

  const uploadedFile = await uploadOnCloudinary(fileLocalPath);
  if (!uploadedFile || !uploadedFile.url) {
    throw new apiError(500, "File upload failed.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found.");
  }

  user.avatarUrl.push(uploadedFile.url);

  await user.save();

  console.log("User media updated:", user.avatarUrl);

  res.status(200).json(
    new apiResponse(200, {
      message: "Media uploaded and user updated successfully.",
      avatar: user.avatarUrl,
    })
  );
});

export { updateAvatar };

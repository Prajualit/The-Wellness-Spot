// Create a separate middleware for refresh token verification
// middleware/refreshAuth.middleware.js
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  try {
    // Only get refresh token from cookies (more secure)
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return next(new apiError(401, "Refresh token not found"));
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken._id);
      if (!user) {
        return next(new apiError(401, "Invalid refresh token"));
      }

      // Check if the refresh token matches the one stored in database
      if (incomingRefreshToken !== user.refreshToken) {
        return next(new apiError(401, "Refresh token is expired or used"));
      }

      req.user = user;
      req.refreshToken = incomingRefreshToken;
      next();
    } catch (err) {
      console.log("Refresh token error:", err.name);

      if (err.name === "TokenExpiredError") {
        return next(new apiError(401, "Refresh token expired"));
      }

      return next(new apiError(401, "Invalid refresh token"));
    }
  } catch (error) {
    return next(new apiError(401, error?.message || "Invalid refresh token"));
  }
});

import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || "";
    const token =
      req.cookies?.accessToken ||
      (authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null);

    if (!token) {
      return next(new apiError(401, "Unauthorized request"));
    }

    try {
      // 1️⃣ Verify the token
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // 2️⃣ Fetch user
      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      if (!user) {
        return next(new apiError(401, "Invalid Access token"));
      }

      req.user = user;
      next();
    } catch (err) {
      // 3️⃣ Check if it's an expired token & logout route
      if (
        err.name === "TokenExpiredError" &&
        req.originalUrl.includes("/logout")
      ) {
        // Let logout proceed without a valid user (no DB check)
        return next();
      }

      if (err.name === "TokenExpiredError") {
        return next(new apiError(401, "Access token expired"));
      }

      // 4️⃣ All other verification errors
      return next(new apiError(401, "Invalid Access token"));
    }
  } catch (error) {
    return next(new apiError(401, error?.message || "Unauthorized request"));
  }
});

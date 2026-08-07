import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || "";
    
    // Try cookies first, then Authorization header
    let token = req.cookies?.accessToken;
    
    if (!token && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    }

    if (!token) {
      return next(new apiError(401, "Unauthorized request"));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      if (!user) {
        return next(new apiError(401, "Invalid Access token"));
      }

      req.user = user;
      next();
    } catch (err) {
      if (
        err.name === "TokenExpiredError" &&
        req.originalUrl.includes("/logout")
      ) {
        return next();
      }

      if (err.name === "TokenExpiredError") {
        return next(new apiError(401, "Access token expired"));
      }

      return next(new apiError(401, "Invalid Access token"));
    }
  } catch (error) {
    console.error('❌ AUTH MIDDLEWARE: Unexpected error:', error?.message || error);
    return next(new apiError(401, error?.message || "Unauthorized request"));
  }
});

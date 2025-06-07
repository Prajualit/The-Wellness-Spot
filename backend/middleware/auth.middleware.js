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
      // 🔍 Add logging to debug
      console.log("Token error:", err.name);
      console.log("Request URL:", req.originalUrl);
      console.log("Is logout route:", req.originalUrl.includes("/logout"));

      if (
        err.name === "TokenExpiredError" &&
        req.originalUrl.includes("/logout")
      ) {
        console.log("Allowing logout with expired token");
        return next();
      }

      if (err.name === "TokenExpiredError") {
        return next(new apiError(401, "Access token expired"));
      }

      return next(new apiError(401, "Invalid Access token"));
    }
  } catch (error) {
    return next(new apiError(401, error?.message || "Unauthorized request"));
  }
});

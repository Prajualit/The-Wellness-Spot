import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || "";
    
    // Try cookies first, then Authorization header
    let token = req.cookies?.accessToken;
    let authMethod = "cookies";
    
    if (!token && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
      authMethod = "header";
    }

    console.log('🔐 AUTH MIDDLEWARE Debug:');
    console.log('- Request URL:', req.originalUrl);
    console.log('- Request method:', req.method);
    console.log('- Request origin:', req.headers.origin);
    console.log('- Cookies received:', req.cookies);
    console.log('- Authorization header:', authHeader ? 'exists' : 'missing');
    console.log('- Token from cookies:', req.cookies?.accessToken ? 'exists' : 'missing');
    console.log('- Token from header:', authHeader.startsWith("Bearer ") ? 'exists' : 'missing');
    console.log('- Final token:', token ? 'exists' : 'missing');
    console.log('- Auth method used:', authMethod);

    if (!token) {
      console.log('❌ AUTH MIDDLEWARE: No token found');
      return next(new apiError(401, "Unauthorized request"));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      if (!user) {
        console.log('❌ AUTH MIDDLEWARE: User not found for token');
        return next(new apiError(401, "Invalid Access token"));
      }

      console.log(`✅ AUTH MIDDLEWARE: Authentication successful via ${authMethod} for user:`, user._id);
      req.user = user;
      next();
    } catch (err) {
      // 🔍 Add logging to debug
      console.log("❌ AUTH MIDDLEWARE: Token error:", err.name);
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
    console.error('❌ AUTH MIDDLEWARE: Unexpected error:', error);
    return next(new apiError(401, error?.message || "Unauthorized request"));
  }
});

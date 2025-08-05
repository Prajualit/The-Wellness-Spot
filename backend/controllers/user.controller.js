import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import admin from "../lib/firebaseAdmin.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      error?.message ||
        "Something went wrong while generating Access and Refresh Token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { idToken, name: frontEndName } = req.body;

  if (!idToken) {
    throw new apiError(400, "ID Token is required");
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw new apiError(401, "Invalid or expired ID token");
  }

  const phone = decodedToken.phone_number;
  if (!phone) {
    throw new apiError(400, "Phone number not found in token");
  }

  let user = await User.findOne({ phone });

  if (!user) {
    // User doesn't exist, create new user
    user = await User.create({ name: frontEndName || "Unknown", phone });
  }
  // Note: Name validation is now handled by the /validate endpoint before OTP is sent

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select("-refreshToken");

  // Use consistent cookie options for both development and production
  const isProduction = process.env.NODE_ENV === "production";
  
  // For production, we need proper cross-origin cookie settings
  const options = {
    httpOnly: true,
    secure: isProduction, // Always secure in production
    sameSite: isProduction ? "None" : "Lax", // None for cross-origin in production
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    path: "/",
    // Don't set domain to let browser handle it automatically
  };

  console.log('🍪 BACKEND: Setting cookies with options:', {
    isProduction,
    options,
    accessTokenLength: accessToken?.length,
    refreshTokenLength: refreshToken?.length,
    requestOrigin: req.headers.origin,
    requestHost: req.headers.host,
    userAgent: req.headers['user-agent'],
    secureConnection: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  const response = res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  // Log response headers to see if cookies are being set
  console.log('🍪 BACKEND: Response headers with cookies:', response.getHeaders());

  return response.json(
    new apiResponse(
      200,
      { user: loggedInUser, accessToken, refreshToken },
      "User logged in successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Try to find and update user, but don't fail if token is invalid
      try {
        const decodedToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        await User.findByIdAndUpdate(
          decodedToken._id,
          { $unset: { refreshToken: 1 } },
          { new: true }
        );
      } catch (err) {
        console.log("Token already expired during logout, proceeding...");
      }
    }

    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new apiResponse(200, null, "User logged out successfully"));
  } catch (error) {
    // Even if there's an error, clear cookies and return success
    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    const { accessToken, refreshToken: newRefreshToken } =
      await user.generateAccessAndRefreshTokens();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    const refreshOptions = {
      ...options,
      maxAge: 10 * 24 * 60 * 60 * 1000, 
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, refreshOptions)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new apiError(500, "Something went wrong while refreshing token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  res
    .status(200)
    .json(
      new apiResponse(200, req.user, "Current user retrieved successfully")
    );
});

const validateUserDetails = asyncHandler(async (req, res) => {
  console.log("📝 VALIDATE: Starting user validation", {
    body: { name: req.body.name ? "***" : undefined, phone: req.body.phone ? "***" : undefined },
    timestamp: new Date().toISOString()
  });

  const { name, phone } = req.body;

  if (!name || !phone) {
    console.log("❌ VALIDATE: Missing required fields");
    throw new apiError(400, "Name and phone number are required");
  }

  try {
    // Format phone to match database format (assuming it's stored with +91)
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    console.log("🔍 VALIDATE: Checking user existence in database");

    const user = await User.findOne({ phone: formattedPhone });

    if (user) {
      console.log("👤 VALIDATE: User found, checking name match");
      // User exists, check if the provided name matches
      if (user.name !== name.trim()) {
        console.log("❌ VALIDATE: Name mismatch");
        throw new apiError(
          400, 
          `Phone number is already registered with a different name.`
        );
      }
    }

    console.log("✅ VALIDATE: Validation successful");
    // If user doesn't exist or name matches, validation passes
    return res
      .status(200)
      .json(
        new apiResponse(200, null, "Validation successful")
      );
  } catch (error) {
    console.error("❌ VALIDATE: Database error", error);
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, "Internal server error during validation");
  }
});

export { loginUser, logoutUser, refreshAccessToken, getCurrentUser, validateUserDetails };

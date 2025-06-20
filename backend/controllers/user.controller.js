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
    // Use frontend name if present, else fallback to "Unknown"
    user = await User.create({ name: frontEndName || "Unknown", phone });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select("-refreshToken");

  // Use consistent cookie options for both development and production
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
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

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new apiResponse(200, null, "User logged out successfully"));
  } catch (error) {
    // Even if there's an error, clear cookies and return success
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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

// In your controller
// controllers/user.controller.js
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const user = req.user; // Already verified by verifyRefreshToken middleware

    const { accessToken, refreshToken: newRefreshToken } =
      await user.generateAccessAndRefreshTokens();

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours for access token
    };

    const refreshOptions = {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
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

// Additional helper function to validate environment variables
const validateEnvironment = () => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET environment variable is not set");
  }
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET environment variable is not set");
  }
};

// Call validation on module load
validateEnvironment();

// ...existing imports...

const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user should be set by your auth middleware
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

// ...existing exports...
export { loginUser, logoutUser, refreshAccessToken, getCurrentUser };

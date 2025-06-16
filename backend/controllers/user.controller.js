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
  if (req.user?._id) {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } }, // Use $unset instead of $set with undefined
      { new: true }
    );
  }

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request - No refresh token provided");
  }

  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new apiError(401, "Invalid refresh token - User not found");
    }

    // Check if the refresh token matches the one stored in database
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // Cookie options
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
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.error("Refresh token error:", error);

    // Clear cookies if refresh token is invalid
    const isProduction = process.env.NODE_ENV === "production";
    const clearOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
    };

    res.clearCookie("accessToken", clearOptions);
    res.clearCookie("refreshToken", clearOptions);

    throw new apiError(401, error?.message || "Invalid refresh token");
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

export { loginUser, logoutUser, refreshAccessToken };

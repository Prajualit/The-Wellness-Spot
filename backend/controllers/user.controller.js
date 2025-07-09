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
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    path: "/",
    domain: isProduction ? undefined : undefined, // Let browser handle domain
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
  const { name, phone } = req.body;

  if (!name || !phone) {
    throw new apiError(400, "Name and phone number are required");
  }

  // Format phone to match database format (assuming it's stored with +91)
  const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

  const user = await User.findOne({ phone: formattedPhone });

  if (user) {
    // User exists, check if the provided name matches
    if (user.name !== name.trim()) {
      throw new apiError(
        400, 
        `Phone number is already registered with a different name.`
      );
    }
  }

  // If user doesn't exist or name matches, validation passes
  return res
    .status(200)
    .json(
      new apiResponse(200, null, "Validation successful")
    );
});

export { loginUser, logoutUser, refreshAccessToken, getCurrentUser, validateUserDetails };

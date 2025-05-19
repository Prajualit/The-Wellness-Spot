import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import User from "../models/user.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
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
  const { name, phone } = req.body;
  if ([name, phone].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const user = await User.findOne({ phone: phone });
  if (!user) {
    const createUser = await User.create({
      name,
      phone,
    });
    const createdUser = await User.findById(createUser._id).select(
      "-refreshToken"
    );
    if (!createdUser) {
      throw new apiError(
        500,
        "Something went wrong while registering the user"
      );
    }
    return res
      .status(201)
      .json(apiResponse(200, createdUser, "User created successfully"));
  } else if (user) {
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select("-refreshToken");

    const options = { httpOnly: true, secure: true };

    // send response
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
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = { httpOnly: true, secure: true };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});

export { loginUser, logoutUser };

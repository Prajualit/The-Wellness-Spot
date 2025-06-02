import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";

const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(2));
};

const addRecord = asyncHandler(async (req, res) => {
  const { weight, height, age } = req.body;

  if (!weight || !height || !age) {
    throw new apiError(400, "userId, weight, height, and age are required.");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new apiError(404, "User not found.");
  }

  const bmi = calculateBMI(weight, height);
  const newRecord = {
    weight,
    height,
    age,
    bmi,
  };

  user.records.push(newRecord);
  await user.save();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        newRecord,
        allRecords: user.records,
      },
      "Record added successfully."
    )
  );
});

const removeRecord = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { recordId } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { records: { _id: recordId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Record deleted successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting record", error });
  }
});

export { addRecord, removeRecord };

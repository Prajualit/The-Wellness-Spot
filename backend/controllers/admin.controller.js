import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";

const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(2));
};

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-refreshToken -password");

    return res
      .status(200)
      .json(new apiResponse(200, { users }, "Users fetched successfully"));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw new apiError(500, "Failed to fetch users");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new apiError(404, "User not found");
    }

    return res.status(200).json(
        new apiResponse(200, null, "User deleted successfully")
    );
});

const updateUserRecord = asyncHandler(async (req, res) => {
  try {
    const { userId, recordId } = req.params;
    const { 
      age,
      height,
      startingWeight,
      lastWeight,
      energy,
      digestion,
      sleepQuality,
      snackingHabit,
      sugarSaltCravings,
      medicineHistory,
      waterIntake,
      exercise,
      stressLevel
    } = req.body;

    // Validate required fields
    if (!age || !height || !startingWeight || !lastWeight || 
        !energy || !digestion || !sleepQuality || !snackingHabit || 
        !sugarSaltCravings || !waterIntake || !exercise || !stressLevel) {
      throw new apiError(400, "All required fields must be provided.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(404, "User not found.");
    }

    // Find the record to update
    const recordIndex = user.records.findIndex(
      (record) => record._id.toString() === recordId
    );

    if (recordIndex === -1) {
      throw new apiError(404, "Record not found.");
    }

    // Calculate new BMI
    const bmi = calculateBMI(lastWeight, height);

    // Update the record with all fields
    user.records[recordIndex].age = age;
    user.records[recordIndex].height = height;
    user.records[recordIndex].startingWeight = startingWeight;
    user.records[recordIndex].lastWeight = lastWeight;
    user.records[recordIndex].weight = lastWeight; // keeping for backward compatibility
    user.records[recordIndex].bmi = bmi;
    user.records[recordIndex].energy = energy;
    user.records[recordIndex].digestion = digestion;
    user.records[recordIndex].sleepQuality = sleepQuality;
    user.records[recordIndex].snackingHabit = snackingHabit;
    user.records[recordIndex].sugarSaltCravings = sugarSaltCravings;
    user.records[recordIndex].medicineHistory = medicineHistory || "";
    user.records[recordIndex].waterIntake = waterIntake;
    user.records[recordIndex].exercise = exercise;
    user.records[recordIndex].stressLevel = stressLevel;

    await user.save();

    return res.status(200).json(
      new apiResponse(
        200,
        {
          updatedRecord: user.records[recordIndex],
          updatedUser: user,
        },
        "Record updated successfully."
      )
    );
  } catch (error) {
    console.error(error);
    if (error instanceof apiError) {
      throw error;
    }
    res.status(500).json({ message: "Error updating record", error });
  }
});

const deleteUserRecord = asyncHandler(async (req, res) => {
  try {
    const { userId, recordId } = req.params;

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

const addUserRecord = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      age,
      height,
      startingWeight,
      lastWeight,
      energy,
      digestion,
      sleepQuality,
      snackingHabit,
      sugarSaltCravings,
      medicineHistory,
      waterIntake,
      exercise,
      stressLevel
    } = req.body;

    // Validate required fields
    if (!age || !height || !startingWeight || !lastWeight || 
        !energy || !digestion || !sleepQuality || !snackingHabit || 
        !sugarSaltCravings || !waterIntake || !exercise || !stressLevel) {
      throw new apiError(400, "All required fields must be provided.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(404, "User not found.");
    }

    const bmi = calculateBMI(lastWeight, height);
    const newRecord = {
      age,
      height,
      startingWeight,
      lastWeight,
      weight: lastWeight, // keeping for backward compatibility
      bmi,
      energy,
      digestion,
      sleepQuality,
      snackingHabit,
      sugarSaltCravings,
      medicineHistory: medicineHistory || "",
      waterIntake,
      exercise,
      stressLevel,
    };

    user.records.push(newRecord);
    await user.save();

    return res.status(200).json(
      new apiResponse(
        200,
        {
          newRecord,
          allRecords: user.records,
          updatedUser: user,
        },
        "Record added successfully."
      )
    );
  } catch (error) {
    console.error(error);
    if (error instanceof apiError) {
      throw error;
    }
    res.status(500).json({ message: "Error adding record", error });
  }
});

export { getAllUsers, deleteUser, updateUserRecord, deleteUserRecord, addUserRecord };

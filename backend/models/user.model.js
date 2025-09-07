import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const bmiRecordSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  height: { type: Number, required: true }, // in cm
  weight: { type: Number, required: true }, // keeping for backward compatibility
  startingWeight: { type: Number, required: true }, // in kg
  lastWeight: { type: Number, required: true }, // in kg (current weight)
  bmi: { type: Number, required: true },
  energy: { 
    type: String, 
    enum: ['Low', 'Moderate', 'High', 'Very High'],
    required: true 
  },
  digestion: { 
    type: String, 
    enum: ['Poor', 'Fair', 'Good', 'Excellent'],
    required: true 
  },
  sleepQuality: { 
    type: String, 
    enum: ['Poor', 'Fair', 'Good', 'Excellent'],
    required: true 
  },
  snackingHabit: { 
    type: String, 
    enum: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
    required: true 
  },
  sugarSaltCravings: { 
    type: String, 
    enum: ['None', 'Mild', 'Moderate', 'Strong', 'Very Strong'],
    required: true 
  },
  medicineHistory: { type: String, required: false }, // Text field for medicine details
  waterIntake: { type: Number, required: true }, // in liters
  exercise: { 
    type: String, 
    enum: ['None', 'Light', 'Moderate', 'Intense', 'Very Intense'],
    required: true 
  },
  stressLevel: { 
    type: String, 
    enum: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    records: [bmiRecordSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.verifyPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);

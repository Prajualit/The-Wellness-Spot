import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      enum: ["transformations", "gallery", "videos"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Media = mongoose.model("Media", mediaSchema);

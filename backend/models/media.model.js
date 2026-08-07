import mongoose, { Schema } from "mongoose";
import { toSecureUrl } from "../utils/secureUrl.js";

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
    toJSON: { transform: secureMediaTransform },
    toObject: { transform: secureMediaTransform },
  }
);

function secureMediaTransform(doc, ret) {
  ret.url = toSecureUrl(ret.url);
  return ret;
}

export const Media = mongoose.model("Media", mediaSchema);

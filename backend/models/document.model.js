import mongoose, { Schema } from "mongoose";
import { toSecureUrl } from "../utils/secureUrl.js";

const documentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "raw"],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { transform: secureDocumentTransform },
    toObject: { transform: secureDocumentTransform },
  }
);

function secureDocumentTransform(doc, ret) {
  ret.url = toSecureUrl(ret.url);
  return ret;
}

export const Document = mongoose.model("Document", documentSchema);

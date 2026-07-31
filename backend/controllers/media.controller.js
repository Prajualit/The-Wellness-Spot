import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Media } from "../models/media.model.js";

const SECTION_TYPES = {
  transformations: "image",
  gallery: "image",
  videos: "video",
};

const uploadMedia = asyncHandler(async (req, res) => {
  const section = req.body.section;

  if (!section || !SECTION_TYPES[section]) {
    throw new apiError(400, "Please select a valid section.");
  }

  if (!req.file) {
    throw new apiError(400, "Media file is required.");
  }

  const isVideo = req.file.mimetype.startsWith("video/");
  const expectedType = SECTION_TYPES[section];

  if (isVideo && expectedType !== "video") {
    throw new apiError(400, "Only images are allowed in this section.");
  }
  if (!isVideo && expectedType !== "image") {
    throw new apiError(400, "Only videos are allowed in this section.");
  }

  const uploadedFile = await uploadOnCloudinary(path.normalize(req.file.path), {
    resource_type: expectedType === "video" ? "video" : "image",
    folder: "wellness-spot",
  });

  if (!uploadedFile || !uploadedFile.url) {
    throw new apiError(500, "File upload to Cloudinary failed.");
  }

  const media = await Media.create({
    type: expectedType,
    url: uploadedFile.url,
    cloudinaryPublicId: uploadedFile.public_id,
    section,
  });

  res.status(201).json(
    new apiResponse(201, { media }, "Media uploaded successfully.")
  );
});

const isMissingFromCloudinary = (error) => {
  const body = error?.error;
  const code = error?.http_code ?? body?.http_code;
  const message = error?.message ?? body?.message;
  return code === 404 || (code === undefined && /not found/i.test(message || ""));
};

const existsOnCloudinary = async (publicId, resourceType) => {
  try {
    await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return true;
  } catch (error) {
    if (isMissingFromCloudinary(error)) return false;
    return true;
  }
};

const getAllMedia = asyncHandler(async (req, res) => {
  const section = req.query.section;

  if (section && !SECTION_TYPES[section]) {
    throw new apiError(400, "Invalid section.");
  }

  const filter = section ? { section } : {};
  const media = await Media.find(filter).sort({ createdAt: -1 });

  const validMedia = [];
  const staleIds = [];

  for (const item of media) {
    const exists = await existsOnCloudinary(
      item.cloudinaryPublicId,
      item.type === "video" ? "video" : "image"
    );
    if (exists) {
      validMedia.push(item);
    } else {
      staleIds.push(item._id);
    }
  }

  if (staleIds.length > 0) {
    await Media.deleteMany({ _id: { $in: staleIds } });
  }

  res.status(200).json(new apiResponse(200, { media: validMedia }));
});

export { uploadMedia, getAllMedia };

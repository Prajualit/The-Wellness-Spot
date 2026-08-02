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

const MAX_MEDIA_SIZE_BYTES = 50 * 1024 * 1024;

const buildSectionFolder = (section) => `wellness-spot/${section}`;

const getCloudinaryUploadSignature = asyncHandler(async (req, res) => {
  const section = req.query.section;

  if (!section || !SECTION_TYPES[section]) {
    throw new apiError(400, "Please select a valid section.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = buildSectionFolder(section);
  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json(
    new apiResponse(200, {
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
      resourceType: SECTION_TYPES[section],
      signature,
      timestamp,
    })
  );
});

const registerUploadedMedia = asyncHandler(async (req, res) => {
  const { section, url, cloudinaryPublicId } = req.body;

  if (!section || !SECTION_TYPES[section]) {
    throw new apiError(400, "Please select a valid section.");
  }

  if (!url || !cloudinaryPublicId) {
    throw new apiError(400, "Cloudinary upload details are required.");
  }

  const resourceType = SECTION_TYPES[section];
  const cloudinaryResource = await cloudinary.api.resource(cloudinaryPublicId, {
    resource_type: resourceType,
  });

  if (!cloudinaryResource?.bytes) {
    throw new apiError(400, "Unable to verify uploaded media size.");
  }

  if (cloudinaryResource.bytes > MAX_MEDIA_SIZE_BYTES) {
    await cloudinary.uploader.destroy(cloudinaryPublicId, {
      resource_type: resourceType,
    });
    throw new apiError(400, "File is too large. Maximum size is 50 MB.");
  }

  const media = await Media.create({
    type: resourceType,
    url,
    cloudinaryPublicId,
    section,
  });

  res.status(201).json(
    new apiResponse(201, { media }, "Media uploaded successfully.")
  );
});

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

const deleteMedia = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;

  const media = await Media.findById(mediaId);
  if (!media) {
    throw new apiError(404, "Media not found.");
  }

  await cloudinary.uploader.destroy(media.cloudinaryPublicId, {
    resource_type: media.type === "video" ? "video" : "image",
  });

  await Media.findByIdAndDelete(mediaId);

  res.status(200).json(new apiResponse(200, null, "Media deleted successfully."));
});

export {
  getCloudinaryUploadSignature,
  registerUploadedMedia,
  uploadMedia,
  getAllMedia,
  deleteMedia,
};

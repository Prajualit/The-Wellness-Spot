import { v2 as cloudinary } from "cloudinary";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Document } from "../models/document.model.js";

const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "bmp",
  "tiff",
  "heic",
  "heif",
  "avif",
]);

const ALLOWED_RAW_FORMATS = new Set(["pdf", "doc", "docx"]);

const buildDocumentFolder = (userId) => `wellness-spot/user-documents/${userId}`;

const isMissingFromCloudinary = (error) => {
  const body = error?.error;
  const code = error?.http_code ?? body?.http_code;
  const message = error?.message ?? body?.message;
  return code === 404 || (code === undefined && /not found/i.test(message || ""));
};

const lookupCloudinaryResource = async (publicId, resourceType) => {
  try {
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
    return resource;
  } catch (error) {
    if (isMissingFromCloudinary(error)) return null;
    throw error;
  }
};

const getCloudinaryDocumentSignature = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User id is required.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = buildDocumentFolder(userId);
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
      signature,
      timestamp,
    })
  );
});

const registerUserDocument = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const {
    url,
    cloudinaryPublicId,
    resourceType,
    fileName,
    mimeType,
    size,
  } = req.body;

  if (!userId) {
    throw new apiError(400, "User id is required.");
  }

  if (!url || !cloudinaryPublicId) {
    throw new apiError(400, "Cloudinary upload details are required.");
  }

  if (resourceType !== "image" && resourceType !== "raw") {
    throw new apiError(400, "Invalid resource type.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found.");
  }

  // Resolve the actual Cloudinary resource. Try the claimed type first, then the
  // other type, so a mismatch between the client's claim and the real asset is
  // detected instead of trusted.
  let cloudinaryResource = null;
  let actualType = null;
  const lookupOrder =
    resourceType === "raw" ? ["raw", "image"] : ["image", "raw"];
  for (const type of lookupOrder) {
    const candidate = await lookupCloudinaryResource(cloudinaryPublicId, type);
    if (candidate) {
      cloudinaryResource = candidate;
      actualType = type;
      break;
    }
  }

  if (!cloudinaryResource) {
    throw new apiError(400, "Unable to verify the uploaded file on Cloudinary.");
  }

  // Cloudinary populates `format` for image assets but leaves it undefined for
  // `raw` assets. For raw uploads the extension is part of the public_id
  // (e.g. ".../abc123.pdf"), so fall back to that.
  const format = String(
    cloudinaryResource.format || cloudinaryPublicId.split(".").pop() || ""
  ).toLowerCase();
  const allowedFormats =
    actualType === "raw" ? ALLOWED_RAW_FORMATS : ALLOWED_IMAGE_FORMATS;

  if (!allowedFormats.has(format)) {
    await cloudinary.uploader.destroy(cloudinaryPublicId, {
      resource_type: actualType,
    });
    throw new apiError(
      400,
      "File type not allowed. Only images, PDF and Word documents are allowed."
    );
  }

  if (!cloudinaryResource.bytes) {
    throw new apiError(400, "Unable to verify uploaded file size.");
  }

  if (cloudinaryResource.bytes > MAX_DOCUMENT_SIZE_BYTES) {
    await cloudinary.uploader.destroy(cloudinaryPublicId, {
      resource_type: actualType,
    });
    throw new apiError(400, "File is too large. Maximum size is 20 MB.");
  }

  const document = await Document.create({
    userId,
    url,
    cloudinaryPublicId,
    resourceType: actualType,
    fileName: fileName || "Document",
    mimeType: mimeType || cloudinaryResource.format || "",
    size: cloudinaryResource.bytes || size || 0,
  });

  res.status(201).json(
    new apiResponse(201, { document }, "Document uploaded successfully.")
  );
});

const getUserDocuments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User id is required.");
  }

  const user = await User.findById(userId).select("name phone");
  if (!user) {
    throw new apiError(404, "User not found.");
  }

  const documents = await Document.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json(
    new apiResponse(
      200,
      {
        documents,
        userName: user.name,
        userPhone: user.phone,
      },
      "Documents fetched successfully."
    )
  );
});

const deleteUserDocument = asyncHandler(async (req, res) => {
  const { userId, documentId } = req.params;

  const document = await Document.findOne({ _id: documentId, userId });
  if (!document) {
    throw new apiError(404, "Document not found.");
  }

  await cloudinary.uploader.destroy(document.cloudinaryPublicId, {
    resource_type: document.resourceType,
  });

  await Document.findByIdAndDelete(documentId);

  res.status(200).json(
    new apiResponse(200, null, "Document deleted successfully.")
  );
});

export {
  getCloudinaryDocumentSignature,
  registerUserDocument,
  getUserDocuments,
  deleteUserDocument,
};

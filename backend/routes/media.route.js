import { Router } from "express";
import {
	deleteMedia,
	getAllMedia,
	getCloudinaryUploadSignature,
	registerUploadedMedia,
	uploadMedia,
} from "../controllers/media.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { mediaUpload } from "../middleware/mediaUpload.middleware.js";

const router = Router();

router.route("/").get(getAllMedia);
router.route("/signature").get(verifyJWT, getCloudinaryUploadSignature);
router.route("/register").post(verifyJWT, registerUploadedMedia);
router.route("/upload").post(verifyJWT, mediaUpload.single("media"), uploadMedia);
router.route("/:mediaId").delete(verifyJWT, deleteMedia);

export default router;

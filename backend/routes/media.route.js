import { Router } from "express";
import { uploadMedia, getAllMedia } from "../controllers/media.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { mediaUpload } from "../middleware/mediaUpload.middleware.js";

const router = Router();

router.route("/").get(getAllMedia);
router.route("/upload").post(verifyJWT, mediaUpload.single("media"), uploadMedia);

export default router;

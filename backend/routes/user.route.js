import { loginUser, logoutUser } from "../controllers/user.controller.js";
import { updateAvatar } from "../controllers/updateAvatar.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-avatar").post(verifyJWT, upload.single("file"), updateAvatar);

export default router;
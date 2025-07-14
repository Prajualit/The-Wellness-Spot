import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  validateUserDetails,
} from "../controllers/user.controller.js";
import { updateAvatar } from "../controllers/updateAvatar.controller.js";
import {
  addRecord,
  removeRecord,
} from "../controllers/addRecord.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyRefreshToken } from "../middleware/refreshAuth.middleware.js";
import { Router } from "express";

const router = Router();

// Explicit OPTIONS handler for validate endpoint
router.options("/validate", (req, res) => {
  res.status(200).end();
});

router.route("/validate").post(validateUserDetails);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("file"), updateAvatar);
router.route("/add-record").post(verifyJWT, addRecord);
router.get("/me", verifyJWT, getCurrentUser);
router.route("/remove-record/:recordId").delete(verifyJWT, removeRecord);
router.route("/refresh-token").post(verifyRefreshToken, refreshAccessToken);

export default router;

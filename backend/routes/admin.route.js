import { getAllUsers } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/get-all-users").get(verifyJWT, getAllUsers);

export default router;
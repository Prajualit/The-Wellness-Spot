import { getAllUsers, deleteUser, updateUserRecord, deleteUserRecord, addUserRecord } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/get-all-users").post(verifyJWT, getAllUsers);
router.delete("/delete-user/:userId", verifyJWT, deleteUser);
router.route("/add-user-record/:userId").post(verifyJWT, addUserRecord);
router.route("/update-user-record/:userId/:recordId").patch(verifyJWT, updateUserRecord);
router.route("/delete-user-record/:userId/:recordId").delete(verifyJWT, deleteUserRecord);

export default router;

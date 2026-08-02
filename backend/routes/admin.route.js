import { getAllUsers, addUser, deleteUser, updateUserRecord, deleteUserRecord, addUserRecord, updateUserDietChart } from "../controllers/admin.controller.js";
import {
  getCloudinaryDocumentSignature,
  registerUserDocument,
  getUserDocuments,
  deleteUserDocument,
} from "../controllers/document.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/get-all-users").post(verifyJWT, getAllUsers);
router.route("/add-user").post(verifyJWT, addUser);
router.delete("/delete-user/:userId", verifyJWT, deleteUser);
router.route("/add-user-record/:userId").post(verifyJWT, addUserRecord);
router.route("/update-user-record/:userId/:recordId").patch(verifyJWT, updateUserRecord);
router.route("/delete-user-record/:userId/:recordId").delete(verifyJWT, deleteUserRecord);
router.route("/update-diet-chart/:userId/:recordId").patch(verifyJWT, updateUserDietChart);

router.route("/user-documents/:userId").get(verifyJWT, getUserDocuments);
router.route("/user-documents/signature/:userId").get(verifyJWT, getCloudinaryDocumentSignature);
router.route("/user-documents/register/:userId").post(verifyJWT, registerUserDocument);
router.route("/user-documents/:userId/:documentId").delete(verifyJWT, deleteUserDocument);

export default router;

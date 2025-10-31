import express from "express";
import {
  updateAvatar,
  updateProfile,
  getProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // for handling file uploads

const router = express.Router();

// ✅ Get user profile
router.get("/profile", protect, getProfile);

// ✅ Update bio, name
router.put("/profile", protect, updateProfile);

// ✅ Update avatar (multipart/form-data)
router.put("/avatar", protect, upload.single("avatar"), updateAvatar);

export default router;

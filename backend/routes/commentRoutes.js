import express from "express";
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  deleteCommentByAdmin,
  getAllComments,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, createComment);
router.get("/:postId", getCommentsByPost);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

// Admin routes
router.get("/", protect, adminMiddleware, getAllComments);
router.delete("/admin/:id", protect, adminMiddleware, deleteCommentByAdmin);

export default router;

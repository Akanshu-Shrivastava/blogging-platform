import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  toggleLike,
  getCategories,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create a new blog (private + image upload)
router.post("/", protect, upload.single("coverImage"), createBlog);

// Get all blogs (public)
router.get("/", getBlogs);

// Get categories
router.get("/categories", getCategories);

// Get single blog by ID (public)
router.get("/:id", getBlogById);

// Toggle like on blog (private)
router.put("/:id/like", protect, toggleLike);

// Update Blog (private + image upload)
router.put("/:id", protect, upload.single("coverImage"), updateBlog);

// Delete Blog (private)
router.delete("/:id", protect, deleteBlog);

export default router;

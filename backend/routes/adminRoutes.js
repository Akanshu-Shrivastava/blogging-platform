import express from "express";
import { protect, adminMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Tag from "../models/Tag.js";
import {
  getAllCommentsAdmin,
  deleteCommentAdmin,
  updateCommentAdmin,
} from "../controllers/adminCommentController.js";
import { getDashboardStats } from "../controllers/adminController.js";


const router = express.Router();

// ========== 🧑‍💻 USER MANAGEMENT ==========
router.get("/users", protect, adminMiddleware, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.delete("/users/:id", protect, adminMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted" });
});

// 🆕 Create user by admin
router.post("/users", protect, adminMiddleware, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    // Create new user (default role: "user")
    const user = await User.create({
      name,
      email,
      password, // 🔒 hashed automatically if your User model has pre-save hashing
      role: role && role === "admin" ? "admin" : "user",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== 📝 BLOG MANAGEMENT ==========
router.get("/blogs", protect, adminMiddleware, async (req, res) => {
  const blogs = await Blog.find().populate("author", "name email role");
  res.json(blogs);
});

router.delete("/blogs/:id", protect, adminMiddleware, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  await blog.deleteOne();
  res.json({ message: "Blog deleted" });
});

// ========== 📂 CATEGORY MANAGEMENT ==========
router.post("/categories", protect, adminMiddleware, async (req, res) => {
  try {
    let { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name required" });
    }

    name = name.trim();

    // ✅ Check duplicate (case-insensitive)
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing)
      return res.status(400).json({ message: "Category already exists" });

    // ✅ Format name (capitalize first letter)
    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const category = new Category({ name: formattedName });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/categories", protect, adminMiddleware, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/categories/:id", protect, adminMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== 🏷️ TAG MANAGEMENT ==========
router.post("/tags", protect, adminMiddleware, async (req, res) => {
  try {
    let { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Tag name required" });
    }

    name = name.trim();

    // ✅ Case-insensitive duplicate check
    const existing = await Tag.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing)
      return res.status(400).json({ message: "Tag already exists" });

    // ✅ Format name nicely
    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const tag = new Tag({ name: formattedName });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/tags", protect, adminMiddleware, async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/tags/:id", protect, adminMiddleware, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    await tag.deleteOne();
    res.json({ message: "Tag deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== 💬 COMMENT MANAGEMENT ==========
router.get("/comments", protect, adminMiddleware, getAllCommentsAdmin);
router.delete("/comments/:id", protect, adminMiddleware, deleteCommentAdmin);
router.put("/comments/:id", protect, adminMiddleware, updateCommentAdmin);

router.get("/stats", getDashboardStats);

export default router;

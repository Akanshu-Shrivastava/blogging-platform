import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Tag from "../models/Tag.js";
import Comment from "../models/Comment.js";

/* =============================
   🗂 CATEGORY CONTROLLERS
============================= */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =============================
   🏷 TAG CONTROLLERS
============================= */
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const existing = await Tag.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const tag = await Tag.create({ name: name.trim() });
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =============================
   🧮 ADMIN DASHBOARD STATS
============================= */
export const getDashboardStats = async (req, res) => {
  try {
    // Run all counts in parallel for performance
    const [totalUsers, totalBlogs, totalCategories, totalTags, totalComments] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Category.countDocuments(),
      Tag.countDocuments(),
      Comment.countDocuments(),
    ]);

    // Calculate today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [newUsersToday, blogsToday] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: today } }),
      Blog.countDocuments({ createdAt: { $gte: today } }),
    ]);

    // Respond with dashboard data
    res.status(200).json({
      success: true,
      totalUsers,
      totalBlogs,
      totalCategories,
      totalTags,
      totalComments,
      newUsersToday,
      blogsToday,
      activeSessions: Math.floor(Math.random() * 100) + 20, // just a fun metric
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

// ✅ GET all categories
export const getAllCategories = asyncHandler(async (req, res) => {
//   const categories = await Category.find().sort({ createdAt: -1 });
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json(categories);
});

// ✅ DELETE a category (Admin only)
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne();
  res.status(200).json({ message: "Category deleted successfully" });
});

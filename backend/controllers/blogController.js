import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

// ➕ Create Blog
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, excerpt, categories, tags } = req.body;
  console.log('tags createblog :', tags)
  let coverImage = req.body.coverImage;

  // Upload image to Cloudinary (if file uploaded)
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_covers",
    });
    coverImage = result.secure_url;
  }

  // 🔹 Ensure categories exist in DB and convert to ObjectIds
  let categoryIds = [];
  if (categories && categories.length > 0) {
    const categoryNames = Array.isArray(categories)
      ? categories
      : categories.split(",");

    for (const name of categoryNames.map((n) => n.trim())) {
      const normalizedName = name.trim().toLowerCase();
      let category = await Category.findOne({ name: normalizedName });
      if (!category) {
        category = await Category.create({ name: normalizedName });
      }

      categoryIds.push(category._id);
    }
  }

  // ✅ Create blog
  const blog = await Blog.create({
    title,
    content,
    excerpt,
    author: req.user._id,
    categories: categoryIds, // store as ObjectIds
    tags: tags ? tags.toString().split(',') : [],
    coverImage,
  });

  const populatedBlog = await blog.populate([
    { path: "author", select: "name avatar" },
    { path: "categories", select: "name" },
  ]);

  res.status(201).json(populatedBlog);
});

// 📖 Get blogs (with search & category filter)
export const getBlogs = asyncHandler(async (req, res) => {
  const { search, category } = req.query;

  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    const categoryDoc = await Category.findOne({ name: category });
    console.log('category :', categoryDoc)
    if (categoryDoc) query.categories = categoryDoc._id;
  }

  const blogs = await Blog.find(query)
    .populate("author", "name avatar")
    .populate("categories", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(blogs);
});

// 📌 Get blog by ID
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate("author", "name avatar")
    .populate("categories", "name");

    console.log('blog :', blog)

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.json(blog);
});

// ❤️ Toggle like
export const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const userId = req.user._id.toString();

  if (blog.likes.includes(userId)) {
    blog.likes = blog.likes.filter((id) => id.toString() !== userId);
  } else {
    blog.likes.push(userId);
  }

  await blog.save();
  res.json({ likes: blog.likes });
});

// ✅ Get all categories with the number of blogs in each
export const getCategories = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // 🧮 Aggregate blog counts where category ID exists in blog.categories array
    const counts = await Blog.aggregate([
      { $unwind: "$categories" }, // because it's an array
      {
        $group: {
          _id: "$categories", // each category ObjectId
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a lookup map from aggregation result
    const countMap = {};
    counts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    // Merge count into category objects
    const categoriesWithCount = categories.map((category) => ({
      ...category.toObject(),
      blogCount: countMap[category._id.toString()] || 0,
    }));

    res.status(200).json(categoriesWithCount);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};



// ✏️ Update Blog
export const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, categories, tags, excerpt, coverImage } = req.body;
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to edit this blog");
  }

  // 🔹 Update categories if provided
  let categoryIds = blog.categories;
  if (categories && categories.length > 0) {
    const categoryNames = Array.isArray(categories)
      ? categories
      : categories.split(",");
    categoryIds = [];
    for (const name of categoryNames.map((n) => n.trim())) {
      const normalizedName = name.trim().toLowerCase();
      let category = await Category.findOne({ name: normalizedName });
      if (!category) {
        category = await Category.create({ name: normalizedName });
      }

      categoryIds.push(category._id);
    }
  }

  // Update fields
  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.excerpt = excerpt || blog.excerpt;
  blog.categories = categoryIds;
  blog.tags = tags ? tags.split(",") : blog.tags;

  // ✅ Handle cover image
  if (req.file) {
    if (blog.coverImage) {
      try {
        const publicId = blog.coverImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`blog_covers/${publicId}`);
      } catch (err) {
        console.warn("Failed to delete old cover:", err.message);
      }
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_covers",
    });
    blog.coverImage = result.secure_url;
  } else if (coverImage) {
    blog.coverImage = coverImage;
  }

  const updatedBlog = await blog.save();
  const populatedBlog = await updatedBlog.populate([
    { path: "author", select: "name avatar" },
    { path: "categories", select: "name" },
  ]);

  res.json({
    ...populatedBlog.toObject(),
    coverImage: blog.coverImage,
  });
});

// ❌ Delete Blog
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this blog");
  }

  if (blog.coverImage) {
    try {
      const publicId = blog.coverImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`blog_covers/${publicId}`);
    } catch (err) {
      console.warn("Failed to delete cover from Cloudinary:", err.message);
    }
  }

  await blog.deleteOne();
  res.json({ message: "Blog deleted successfully" });
});

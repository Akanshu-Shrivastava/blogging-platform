  import mongoose from "mongoose";

  const blogSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      excerpt: { type: String },
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      coverImage: { type: String },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // ✅ updated
      tags: [{ type: String }],
      published: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  const Blog = mongoose.model("Blog", blogSchema);
  export default Blog;

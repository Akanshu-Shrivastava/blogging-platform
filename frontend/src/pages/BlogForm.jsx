import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlogAPI } from "../api/axios.js";

const BlogForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState(null); // file upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("categories", categories); // comma separated
      formData.append("tags", tags); // comma separated
      if (coverImage) {
        formData.append("coverImage", coverImage); // file goes here
      }

      await BlogAPI.createBlog(formData);

      navigate("/"); // redirect to home after posting
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Create Blog</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block font-medium">Excerpt</label>
          <textarea
            className="w-full p-2 border rounded"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          ></textarea>
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium">Content</label>
          <textarea
            className="w-full p-2 border rounded h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Categories */}
        <div>
          <label className="block font-medium">Categories</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="e.g. Tech, Lifestyle"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium">Tags</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="e.g. JavaScript, React"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block font-medium">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
          {coverImage && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {coverImage.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;

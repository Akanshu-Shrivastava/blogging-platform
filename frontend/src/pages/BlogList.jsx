import { useEffect, useState } from "react";
import { BlogAPI } from "../api/axios";
import { Link } from "react-router-dom";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // ✅ Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await BlogAPI.getBlogs({ search, category });
      setBlogs(res.data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await BlogAPI.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, category]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <p>No blogs found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="border rounded-lg shadow hover:shadow-md transition overflow-hidden"
            >
              {b.coverImage && (
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold line-clamp-2">{b.title}</h2>
                <p className="text-gray-600 text-sm mb-1">
                  By {b.author?.name || "Unknown"}
                </p>

                {/* ✅ Category display */}
                {b.category && (
                  <p className="text-sm text-blue-600 mb-2">
                    {b.category.name || b.category}
                  </p>
                )}

                <p className="text-gray-700 text-sm line-clamp-3">
                  {b.content.replace(/<[^>]+>/g, "")}
                </p>

                <Link
                  to={`/blogs/${b._id}`}
                  className="mt-3 inline-block text-blue-600 hover:underline text-sm font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;

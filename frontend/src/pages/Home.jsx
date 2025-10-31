import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Heart,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Clock,
  Tag,
  ChevronDown,
  X
} from "lucide-react";
import { BlogAPI } from "../api/axios.js";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const defaultAvatar = "/images/default-avatar.png";
  const categoryDropdownRef = useRef(null);

  const likeSound = useRef(new Audio("/sound/like.mp3"));
  const unlikeSound = useRef(new Audio("/sound/unlike.mp3"));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await BlogAPI.getBlogs({
          search: searchTerm,
          category: categoryFilter,
        });
        setBlogs(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [searchTerm, categoryFilter]);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await BlogAPI.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Like/unlike handler
  const handleLike = async (id) => {
    try {
      const res = await BlogAPI.toggleLike(id);
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id ? { ...blog, likes: res.data.likes } : blog
        )
      );

      const isLiked = res.data.likes.includes(user?._id);
      if (isLiked) {
        likeSound.current.currentTime = 0;
        likeSound.current.play();
      } else {
        unlikeSound.current.currentTime = 0;
        unlikeSound.current.play();
      }
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to like blog");
    }
  };

  const handleCategorySelect = (category) => {
    setCategoryFilter(category.name);
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const clearCategoryFilter = () => {
    setCategoryFilter("");
    setSelectedCategory(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Category colors for visual variety
  const categoryColors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
    "from-red-500 to-red-600"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 left-5% w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-40"
        variants={floatingAnimation}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-10% w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-40"
        variants={floatingAnimation}
        animate="animate"
        transition={{ delay: 1 }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg mb-6"
          >
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BlogSphere
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-serif italic"
          >
            Discover amazing stories, share your thoughts, and connect with passionate writers from around the world.
          </motion.p>

          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <User size={20} />
                  Sign In
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  Join Community
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.section>

        {/* Search & Filter Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12 relative z-30"
        >
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search stories, topics, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Enhanced Category Dropdown */}
              <div className="flex-1 relative" ref={categoryDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 flex items-center justify-between group relative z-40"
                >
                  <div className="flex items-center gap-3">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">
                      {selectedCategory ? (
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryColors[selectedCategory._id % categoryColors.length]}`} />
                          {selectedCategory.name}
                        </div>
                      ) : (
                        "All Categories"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCategory && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          clearCategoryFilter();
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={14} className="text-gray-400 hover:text-gray-600" />
                      </motion.button>
                    )}
                    <motion.div
                      animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] max-h-80 overflow-hidden"
                    >
                      <div className="p-2 max-h-72 overflow-y-auto">
                        {/* All Categories Option */}
                        <motion.button
                          variants={itemVariants}
                          onClick={() => clearCategoryFilter()}
                          className="w-full p-3 text-left rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                            <Filter size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">All Categories</div>
                            <div className="text-sm text-gray-500">Browse all stories</div>
                          </div>
                        </motion.button>

                        {/* Category List */}
                        {categories.map((category, index) => (
                          <motion.button
                            key={category._id}
                            variants={itemVariants}
                            onClick={() => handleCategorySelect(category)}
                            className="w-full p-3 text-left rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 flex items-center gap-3 group"
                            whileHover={{ x: 4 }}
                          >
                            <div className={`w-8 h-8 bg-gradient-to-r ${categoryColors[index % categoryColors.length]} rounded-lg flex items-center justify-center shadow-lg`}>
                              <Tag size={16} className="text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{category.name}</div>
                              <div className="text-sm text-gray-500">
                                {category.blogCount || 0} stories
                              </div>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              whileHover={{ opacity: 1, scale: 1 }}
                              className="ml-auto"
                            >
                              <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </motion.div>
                          </motion.button>
                        ))}

                        {categories.length === 0 && (
                          <motion.div
                            variants={itemVariants}
                            className="p-4 text-center text-gray-500"
                          >
                            No categories available
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8"
          >
            <p className="text-red-700 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Blog Grid - Ensure lower z-index */}
        <AnimatePresence>
          {!loading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
            >
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <motion.article
                    key={blog._id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group relative z-10"
                  >
                    {/* Blog Image */}
                    <div className="relative overflow-hidden h-48">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={blog.coverImage || "/placeholder-blog.jpg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category Badge */}
                      {blog.category && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute top-4 left-4"
                        >
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full backdrop-blur-sm flex items-center gap-1">
                            <Tag size={12} />
                            {blog.category.name || blog.category}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      {/* Author & Date */}
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <img
                            src={blog.author?.avatar || defaultAvatar}
                            alt={blog.author?.name || "Unknown"}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                          />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {blog.author?.name || "Unknown"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={12} />
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <Link to={`/blogs/${blog._id}`}>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                          {blog.title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {blog.excerpt
                          ? blog.excerpt
                          : blog.content.replace(/<[^>]+>/g, "").slice(0, 120) + "..."}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={() => handleLike(blog._id)}
                            disabled={!user}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                              blog.likes.includes(user?._id)
                                ? "bg-red-500 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <Heart
                              size={18}
                              fill={blog.likes.includes(user?._id) ? "currentColor" : "none"}
                            />
                            <span>{blog.likes.length}</span>
                          </button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            to={`/blogs/${blog._id}`}
                            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group/read"
                          >
                            Read More
                            <ArrowRight size={16} className="group-hover/read:translate-x-1 transition-transform" />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <div className="max-w-md mx-auto">
                    <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No Stories Yet</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || categoryFilter 
                        ? "No blogs match your search criteria. Try different keywords or categories."
                        : "Be the first to share your story with the community!"}
                    </p>
                    {user && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/create"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <TrendingUp size={20} />
                          Write First Story
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
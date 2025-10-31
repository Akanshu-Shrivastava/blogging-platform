import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MoreVertical, 
  Trash2, 
  Eye,
  Calendar,
  User,
  FileText,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  MessageCircle,
  Heart
} from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogsManagement = ({ onBlogChange, onStatsUpdate }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [showBlogMenu, setShowBlogMenu] = useState(null);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchBlogs();
  }, [currentUser]);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/blogs", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      toast.error('Failed to load blogs', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteConfirm(true);
    setShowBlogMenu(null);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      await axios.delete(`/api/admin/blogs/${blogToDelete._id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      
      setBlogs(blogs.filter((b) => b._id !== blogToDelete._id));
      setShowDeleteConfirm(false);
      setBlogToDelete(null);
      
      // Notify dashboard of blog count change
      if (onBlogChange) onBlogChange(-1);
      if (onStatsUpdate) onStatsUpdate();
      
      toast.success('Blog deleted successfully', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error('Failed to delete blog', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleRefresh = async () => {
    await fetchBlogs();
    // Also trigger stats update in dashboard
    if (onStatsUpdate) onStatsUpdate();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Blog Management</h2>
          <p className="text-gray-600">Manage and monitor all blog posts</p>
        </div>

        <div className="text-sm text-gray-500">
          {filteredBlogs.length} of {blogs.length} blogs
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-gray-50 rounded-2xl"
      >
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search blogs by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            <RefreshCw size={18} />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Blogs Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredBlogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={itemVariants}
              layout
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Blog Header with Image */}
              <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
                {blog.coverImage && (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Actions Menu */}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowBlogMenu(showBlogMenu === blog._id ? null : blog._id)}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </motion.button>

                    <AnimatePresence>
                      {showBlogMenu === blog._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-10 min-w-32"
                        >
                          <button
                            onClick={() => handleDeleteClick(blog)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Delete Blog
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                
                {blog.excerpt && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {truncateText(blog.excerpt, 100)}
                  </p>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={14} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {blog.author?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {blog.author?.email}
                    </p>
                  </div>
                </div>

                {/* Blog Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{blog.views || 0}</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      <span>{blog.likes?.length || 0}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span>{blog.comments?.length || 0}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No blogs found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'No blogs have been published yet'
            }
          </p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Blog</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete <strong>"{blogToDelete?.title}"</strong>? 
                  This action cannot be undone and all comments and likes will be permanently removed.
                </p>
              </div>
              
              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 flex-1"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 flex-1 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Blog
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogsManagement;
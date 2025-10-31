import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  Send, 
  Tag, 
  BookOpen,
  MoreVertical,
  Heart,
  Share2,
  Clock,
  X,
  Save,
  Eye,
  AlertTriangle
} from "lucide-react";
import { BlogAPI, AdminAPI } from "../api/axios.js";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 🔹 Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [showCommentMenu, setShowCommentMenu] = useState(null);
  
  // 🔹 Delete confirmation states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCommentDeleteConfirm, setShowCommentDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Fetch blog + comments
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await BlogAPI.getBlog(id);
        setBlog(res.data);
        console.log('blog : ', res.data)
        setLikeCount(res.data.likes?.length || 0);
        setIsLiked(user && res.data.likes?.includes(user._id));

        const commentsRes = await BlogAPI.getComments(id);
        setComments(commentsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, user]);


  // Delete blog (only author)
  const handleDelete = async () => {
    try {
      await BlogAPI.deleteBlog(id);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete blog");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Open blog delete confirmation
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  // Submit new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await BlogAPI.postComment(id, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post comment");
    }
  };

  // 🗑️ Open comment delete confirmation
  const openCommentDeleteConfirm = (commentId) => {
    setCommentToDelete(commentId);
    setShowCommentDeleteConfirm(true);
    setShowCommentMenu(null);
  };

  // 🗑️ Admin delete comment
  const handleAdminDelete = async () => {
    try {
      await AdminAPI.deleteComment(commentToDelete);
      setComments(comments.filter((c) => c._id !== commentToDelete));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    } finally {
      setShowCommentDeleteConfirm(false);
      setCommentToDelete(null);
    }
  };

  // ✏️ Open edit modal
  const handleOpenEdit = (comment) => {
    setSelectedComment(comment);
    setEditText(comment.text);
    setShowModal(true);
    setShowCommentMenu(null);
  };

  // 💾 Save edited comment
  const handleSaveEdit = async () => {
    try {
      const res = await AdminAPI.updateComment(selectedComment._id, {
        text: editText,
      });
      setComments(
        comments.map((c) =>
          c._id === selectedComment._id ? { ...c, text: res.data.text } : c
        )
      );
      setShowModal(false);
      setSelectedComment(null);
      setEditText("");
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Failed to update comment");
    }
  };

  // Handle like
  const handleLike = async () => {
    if (!user) return;
    
    try {
      const res = await BlogAPI.toggleLike(id);
      setIsLiked(!isLiked);
      setLikeCount(res.data.likes.length);
    } catch (err) {
      console.error("Error liking blog:", err);
    }
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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
      />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
      >
        <p className="text-red-700 font-medium text-lg">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
  
  if (!blog) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md bg-white rounded-2xl p-8 text-center shadow-lg"
      >
        <p className="text-gray-700 font-medium text-lg">Blog not found</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );

  const isAuthor = user && blog.author?._id === user._id;
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Elements */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </motion.button>
        </motion.div>

        {/* Blog Content Card */}
        <motion.article
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Cover Image */}
          {blog.coverImage && (
            <motion.div
              variants={itemVariants}
              className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden"
            >
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          )}

          <div className="p-6 md:p-8">
            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight"
            >
              {blog.title}
            </motion.h1>

            {/* Author Info & Metadata */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.1 }} className="relative">
                  <img
                    src={blog.author?.avatar || "/images/default-avatar.png"}
                    alt={blog.author?.name || "Author"}
                    className="w-12 h-12 rounded-full border-2 border-blue-200 object-cover shadow-lg"
                  />
                </motion.div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {blog.author?.name || "Unknown"}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <Clock size={14} />
                    <span>{new Date(blog.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isLiked
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                <span className="font-semibold">{likeCount}</span>
              </motion.button>
            </motion.div>

            {/* Categories & Tags */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mb-8"
            >
              {blog.categories?.map((cat, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full shadow-lg"
                >
                  <Tag size={12} />
                  {typeof cat === "object" ? cat.name : cat}
                </motion.span>
              ))}
              {blog.tags?.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (blog.categories?.length || 0) * 0.1 + index * 0.1 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border"
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>

            {/* Content */}
            <motion.div
              variants={itemVariants}
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Author Actions */}
            {isAuthor && (
              <motion.div
                variants={itemVariants}
                className="flex gap-3 pt-6 border-t border-gray-100"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={`/blogs/${id}/edit`}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold shadow-lg hover:bg-yellow-600 transition-all duration-300"
                  >
                    <Edit3 size={18} />
                    Edit Blog
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={openDeleteConfirm}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-all duration-300"
                  >
                    <Trash2 size={18} />
                    Delete Blog
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="text-blue-600" size={28} />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          {user ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleCommentSubmit}
              className="mb-8"
            >
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows="4"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newComment.trim()}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  Post
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200 mb-8"
            >
              <p className="text-gray-600">
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Sign in
                </Link>{" "}
                to join the conversation and share your thoughts.
              </p>
            </motion.div>
          )}

          {/* Comments List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {comments.length > 0 ? (
              comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  variants={itemVariants}
                  className="flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 group relative"
                >
                  <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0">
                    <img
                      src={comment.user?.avatar || "/images/default-avatar.png"}
                      alt={comment.user?.name || "User"}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-lg"
                    />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">
                        {comment.user?.name || "Unknown"}
                      </p>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowCommentMenu(showCommentMenu === comment._id ? null : comment._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </motion.button>

                      <AnimatePresence>
                        {showCommentMenu === comment._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-10 min-w-32"
                          >
                            <button
                              onClick={() => handleOpenEdit(comment)}
                              className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-t-xl transition-colors flex items-center gap-2"
                            >
                              <Edit3 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => openCommentDeleteConfirm(comment._id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No comments yet. Be the first to share your thoughts!</p>
              </motion.div>
            )}
          </motion.div>
        </motion.section>
      </div>

      {/* 🧩 Admin Edit Modal */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Edit Comment</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none mb-4"
                rows="4"
              />
              
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗑️ Blog Delete Confirmation Modal */}
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
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Blog</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this blog? This action cannot be undone and all comments will be permanently removed.
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

      {/* 🗑️ Comment Delete Confirmation Modal */}
      <AnimatePresence>
        {showCommentDeleteConfirm && (
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
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Comment</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this comment? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCommentDeleteConfirm(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 flex-1"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdminDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 flex-1 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Comment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetail;
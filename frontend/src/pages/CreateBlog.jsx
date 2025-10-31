import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Image,
  Tag,
  FolderOpen,
  Type,
  FileText,
  Smile,
  Send,
  Eye,
  BookOpen,
  Zap,
  Bold,
  Italic,
  Underline,
  List,
  Link2,
  Quote,
  Code,
  Youtube,
  Twitter,
  CheckCircle,
  X,
  Palette,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { BlogAPI, AdminAPI } from "../api/axios.js";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateBlog = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ====== States ======
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // ====== Enhanced Editor States ======
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const quillRef = useRef(null);

  // ====== Fetch Categories & Tags ======
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          BlogAPI.getCategories(),
          BlogAPI.getTags(),
        ]);

        console.log("tag c:", tagRes.data);
        setCategories(catRes.data || []);
        setTags(tagRes.data || []);
      } catch (err) {
        console.error("Failed to fetch categories/tags:", err);
      }
    };
    fetchMeta();
  }, []);

  // ====== Count words and characters ======
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setCharCount(text.length);
  }, [content]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <p className="text-red-500 text-lg font-semibold">
            Please login to create a blog.
          </p>
        </motion.div>
      </div>
    );
  }

  // ====== Handle Cover Image ======
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
      toast.success("Cover image selected!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // ====== Handle Tag Selection ======
  const handleTagChange = (tag) => {
    if (selectedTags.includes(tag.name)) {
      // Remove tag name
      setSelectedTags(selectedTags.filter((name) => name !== tag.name));
    } else {
      if (selectedTags.length >= 5) {
        toast.error("Maximum 5 tags allowed");
        return;
      }
      console.log("set selected tag :", selectedTags);
      setSelectedTags([...selectedTags, tag.name]);
    }
  };
  // const handleTagChange = (tagId) => {
  //   if (selectedTags.includes(tagId)) {
  //     setSelectedTags(selectedTags.filter((id) => id !== tagId));
  //   } else {
  //     if (selectedTags.length >= 5) {
  //       toast.error('Maximum 5 tags allowed', {
  //         position: "top-right",
  //         autoClose: 5000,
  //       });
  //       return;
  //     }

  //     console.log('tagid :', selectedTags)
  //     setSelectedTags([...selectedTags, tagId]);
  //   }
  // };

  // ====== Add Custom Tag ======
  const handleAddCustomTag = () => {
    if (
      customTag.trim() &&
      !tags.some((tag) => tag.name === customTag.trim())
    ) {
      if (selectedTags.length >= 5) {
        toast.error("Maximum 5 tags allowed", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      const newTag = { _id: `custom-${Date.now()}`, name: customTag.trim() };
      console.log("newTag :", newTag);
      setTags([...tags, newTag]);
      console.log("setTAgs :", tags);
      setSelectedTags([...selectedTags, newTag]);
      setCustomTag("");
      toast.success("Custom tag added!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // ====== Emoji Insertion ======
  const handleEmojiClick = (emojiData) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const cursorPosition = editor.getSelection()?.index || content.length;
      editor.insertText(cursorPosition, emojiData.emoji);
      editor.setSelection(cursorPosition + emojiData.emoji.length);
    }
    setShowEmojiPicker(false);
  };

  // ====== Enhanced Editor Modules ======
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        // Custom handlers can be added here
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "code-block",
  ];

  // ====== Handle Form Submit ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (wordCount < 50) {
      toast.error("Content should be at least 50 words!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("excerpt", excerpt.trim());
      formData.append("content", content);
      if (selectedCategory) formData.append("category", selectedCategory);

      console.log("selected TAgs :", selectedTags);
      selectedTags.forEach((tagId) => formData.append("tags", tagId));
      if (coverImage) formData.append("coverImage", coverImage);

      await BlogAPI.createBlog(formData);

      toast.success("Blog published successfully!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => navigate("/"),
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      {/* Toast Container */}
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

      {/* Background Elements */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-40"
        variants={floatingAnimation}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-40"
        variants={floatingAnimation}
        animate="animate"
        transition={{ delay: 1 }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 font-semibold"
            >
              <ArrowLeft size={20} />
              Back
            </motion.button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Blog
              </h1>
              <p className="text-gray-600">
                Share your story with the world 🌍
              </p>
            </div>
          </div>

          {/* Preview Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
              isPreview
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white/80 text-gray-700 shadow-lg hover:shadow-xl"
            }`}
          >
            <Eye size={18} />
            {isPreview ? "Edit" : "Preview"}
          </motion.button>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <Type size={20} className="text-blue-600" />
                Blog Title
              </label>
              <input
                type="text"
                placeholder="Craft a captivating title that grabs attention..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
                required
              />
            </motion.div>

            {/* Excerpt */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <FileText size={20} className="text-green-600" />
                Excerpt
                <span className="text-sm text-gray-500 font-normal">
                  (Optional)
                </span>
              </label>
              <textarea
                placeholder="A brief summary that makes readers want to dive in..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows="3"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
              />
            </motion.div>

            {/* Cover Image */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <Image size={20} className="text-purple-600" />
                Cover Image
              </label>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all duration-300 mb-4"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full max-w-md h-48 object-cover rounded-xl mx-auto shadow-lg"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setCoverImage(null);
                        setCoverPreview("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <Upload size={40} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">
                      Click to upload cover image
                    </p>
                    <p className="text-gray-400 text-sm">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Category & Tags Row */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <FolderOpen size={20} className="text-orange-600" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <Tag size={20} className="text-pink-600" />
                  Tags
                  <span className="text-sm text-gray-500 font-normal">
                    ({selectedTags.length}/5)
                  </span>
                </label>

                {/* Custom Tag Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add custom tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddCustomTag}
                    className="px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                  >
                    Add
                  </motion.button>
                </div>

                {/* Tags Grid */}
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {tags.map((tag) => (
                    <motion.button
                      key={tag._id}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTagChange(tag)}
                      className={`px-3 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                        selectedTags.includes(tag.name)
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {selectedTags.includes(tag.name) && (
                        <CheckCircle size={14} />
                      )}
                      {tag.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Content Editor */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <BookOpen size={20} className="text-indigo-600" />
                  Content
                </label>

                <div className="flex items-center gap-4">
                  {/* Stats */}
                  <div className="text-sm text-gray-500">
                    {wordCount} words • {charCount} characters
                  </div>

                  {/* Emoji Picker */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300"
                  >
                    <Smile size={18} className="text-yellow-500" />
                  </motion.button>
                </div>
              </div>

              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
                  >
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      height={350}
                      width="100%"
                      searchDisabled={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rich Text Editor */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  placeholder="Write your amazing story... Share your knowledge, experiences, and insights with the world."
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  className="rounded-2xl min-h-[400px]"
                />
              </div>

              {/* Word Count Warning */}
              {wordCount > 0 && wordCount < 50 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm"
                >
                  ⚠️ Your content is a bit short. Consider adding more details
                  to reach at least 50 words.
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-gray-100"
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Publishing Your Story...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Publish Blog
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateBlog;

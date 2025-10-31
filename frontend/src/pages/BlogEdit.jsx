import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  Image, 
  Tag, 
  FolderOpen, 
  Type,
  FileText,
  Smile,
  Upload,
  Crop,
  Eye,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { BlogAPI } from "../api/axios.js";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState();
  const [imageRef, setImageRef] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isImageCropping, setIsImageCropping] = useState(false);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await BlogAPI.getBlog(id);
        const blog = res.data;

        setTitle(blog.title);
        setExcerpt(blog.excerpt || "");
        setContent(blog.content);
        setCategories(blog.categories?.map((c) => c.name).join(", ") || "");
        setTags(blog.tags?.join(", ") || "");
        setPreviewImage(blog.coverImage || "");
        
        toast.success('Blog loaded successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Failed to load blog";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB', {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setCroppedImage(null);
      setIsImageCropping(true);
      
      toast.info('Image selected! Crop as needed.', {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setPreviewImage(null);
      setCroppedImage(null);
    }
  };

  // When image loads inside cropper
  const onImageLoaded = (img) => {
    setImageRef(img);

    const initialCrop = makeAspectCrop(
      { unit: "%", width: 80 },
      1200 / 600,
      img.width,
      img.height
    );
    const centered = centerCrop(initialCrop, img.width, img.height);
    setCrop(centered);
  };

  // Create cropped image blob (with CORS-safe fallback)
  const makeClientCrop = async (crop) => {
    if (imageRef && crop?.width && crop?.height) {
      try {
        const canvas = document.createElement("canvas");
        const scaleX = imageRef.naturalWidth / imageRef.width;
        const scaleY = imageRef.naturalHeight / imageRef.height;
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          imageRef,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY
        );

        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/jpeg", 0.9);
        });
      } catch (error) {
        console.warn("⚠️ Canvas tainted, skipping crop:", error);
        return null;
      }
    }
  };

  // Update cropped image whenever crop changes
  useEffect(() => {
    if (crop?.width && crop?.height && imageRef) {
      makeClientCrop(crop).then((blob) => {
        if (blob) setCroppedImage(blob);
      });
    }
  }, [crop, imageRef]);

  // Handle emoji select
  const handleEmojiClick = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required!', {
        position: "top-right",
        autoClose: 5000,
      });
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("categories", categories);
      formData.append("tags", tags);

      if (croppedImage) {
        formData.append("coverImage", croppedImage, "cover.jpg");
      } else if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await BlogAPI.updateBlog(id, formData);
      
      toast.success('Blog updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        onClose: () => navigate(`/blogs/${id}`)
      });
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update blog";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSaving(false);
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
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
                Edit Blog
              </h1>
              <p className="text-gray-600">Update your story and make it shine ✨</p>
            </div>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <Type size={20} className="text-blue-600" />
                Blog Title
              </label>
              <input
                type="text"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a captivating title..."
                required
              />
            </motion.div>

            {/* Excerpt */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <FileText size={20} className="text-green-600" />
                Excerpt
              </label>
              <textarea
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                rows="3"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of your blog..."
              ></textarea>
            </motion.div>

            {/* Content + Emoji */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <FileText size={20} className="text-purple-600" />
                  Content
                </label>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300"
                >
                  <Smile size={20} className="text-yellow-500" />
                </motion.button>
              </div>

              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  placeholder="Write your amazing story..."
                  theme="snow"
                  className="rounded-2xl"
                  modules={{
                    toolbar: [
                      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['bold', 'italic', 'underline', 'strike'],
                      ['link', 'image', 'video'],
                      ['blockquote', 'code-block'],
                      [{ 'align': [] }],
                      ['clean']
                    ]
                  }}
                />
              </div>
            </motion.div>

            {/* Categories & Tags Row */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Categories */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <FolderOpen size={20} className="text-orange-600" />
                  Categories
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Tech, Lifestyle, Travel..."
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <Tag size={20} className="text-pink-600" />
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="JavaScript, React, Web Development..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Cover Image Upload & Crop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <Image size={20} className="text-green-600" />
                Cover Image
              </label>
              
              {/* File Upload */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all duration-300 mb-4"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload size={40} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Click to upload cover image</p>
                <p className="text-gray-400 text-sm">PNG, JPG, JPEG up to 5MB</p>
              </motion.div>

              {/* Image Cropping */}
              <AnimatePresence>
                {previewImage && isImageCropping && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Crop size={20} className="text-blue-600" />
                      <h3 className="font-semibold text-gray-800">Crop Image</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsImageCropping(false)}
                        className="ml-auto p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                    
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      aspect={1200 / 600}
                      className="rounded-xl overflow-hidden"
                    >
                      <img
                        src={previewImage}
                        crossOrigin="anonymous"
                        onLoad={(e) => onImageLoaded(e.currentTarget)}
                        alt="Preview"
                        className="max-w-full rounded-xl"
                      />
                    </ReactCrop>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cropped Preview */}
              {croppedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <p className="font-semibold text-green-800">Cropped Preview</p>
                  </div>
                  <img
                    src={URL.createObjectURL(croppedImage)}
                    alt="Cropped Preview"
                    className="w-full max-w-md rounded-xl shadow-lg mx-auto"
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-6 border-t border-gray-100"
            >
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {saving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Updating Blog...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Update Blog
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

export default BlogEdit;
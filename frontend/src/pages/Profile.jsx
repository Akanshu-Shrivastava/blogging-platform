import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mail,
  Calendar,
  Edit3,
  Award,
  CheckCircle,
  User,
  X,
  Loader2
} from "lucide-react";
import { UserAPI } from "../api/axios.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fallback updateUser function if not available in authSlice
const useUpdateUser = () => {
  const dispatch = useDispatch();
  
  return (updatedFields) => {
    // Try to import the actual updateUser action
    try {
      // This will work once you add updateUser to authSlice
      import('../features/auth/authSlice').then(module => {
        if (module.updateUser) {
          dispatch(module.updateUser(updatedFields));
        }
      }).catch(() => {
        // Fallback: update localStorage directly
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...updatedFields };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      });
    } catch (error) {
      // Final fallback
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user?.bio || "Hey there! I'm passionate about writing, learning new things, and sharing creative ideas.",
  });

  // Use the fallback hook
  const updateUser = useUpdateUser();

  // Initialize profile data when user changes
  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || "");
      setProfileData({
        bio: user.bio || "Hey there! I'm passionate about writing, learning new things, and sharing creative ideas.",
      });
    }
  }, [user]);

  // Format date
  const formatJoinDate = (dateString) => {
    if (!dateString) return "Recently";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Recently";
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Recently";
    }
  };

  // ✅ Avatar Upload Handler - Fixed
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input
    e.target.value = '';

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarLoading(true);
      const res = await UserAPI.updateAvatar(formData);
      
      if (res.data && res.data.avatar) {
        const newAvatar = res.data.avatar;
        setAvatar(newAvatar);
        
        // Update Redux store with the new avatar
        updateUser({ 
          ...user, 
          avatar: newAvatar 
        });
        
        toast.success("Avatar updated successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload avatar. Please try again.");
    } finally {
      setAvatarLoading(false);
    }
  };

  // ✅ Bio Update - Fixed
  const handleProfileUpdate = async () => {
    if (!profileData.bio.trim()) {
      toast.error("Bio cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const res = await UserAPI.updateProfile({ bio: profileData.bio });
      
      if (res.data && res.data.user) {
        const updatedUser = res.data.user;
        
        // Update Redux store with the new bio
        updateUser(updatedUser);
        
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original user bio
    setProfileData({
      bio: user?.bio || "Hey there! I'm passionate about writing, learning new things, and sharing creative ideas.",
    });
    setIsEditing(false);
  };

  const joinDate = user?.createdAt || user?.joinedAt || user?.updatedAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 relative">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="light" 
        pauseOnHover={false}
      />

      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-8"
        >
          Your Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="relative">
                <img
                  src={avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-2xl mx-auto"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all duration-300">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={avatarLoading}
                />
              </label>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              {user?.name || "User"}
            </h2>
          </div>

          {/* User Info */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex justify-center items-center gap-2 text-gray-600">
              <Mail size={18} className="text-blue-500" />
              <span className="text-lg">{user?.email}</span>
            </div>
            <div className="flex justify-center items-center gap-2 text-gray-600">
              <Calendar size={18} className="text-green-500" />
              <span className="text-lg">Joined {formatJoinDate(joinDate)}</span>
            </div>
            <div className="flex justify-center items-center gap-2 text-gray-600">
              <Award size={18} className="text-amber-500" />
              <span className="text-lg">Writer Level: {user?.role === 'admin' ? 'Admin' : 'Member'}</span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User size={20} className="text-purple-500" />
                About Me
              </h3>
              <button
                onClick={() => !isEditing ? setIsEditing(true) : handleCancelEdit()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? (
                  <>
                    <X size={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 size={16} />
                    Edit Bio
                  </>
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-lg"
                    rows="4"
                    placeholder="Tell us about yourself..."
                    disabled={loading}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="flex-1 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading || !profileData.bio.trim()}
                      className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle size={20} />
                      )}
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-700 leading-relaxed text-lg p-4 bg-gray-50 rounded-2xl border border-gray-200 min-h-[120px] whitespace-pre-wrap">
                    {user?.bio || profileData.bio || "No bio added yet. Click 'Edit Bio' to add one!"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

/* =========================================================
   ✅ Update User Avatar (Cloudinary Upload)
   ========================================================= */
export const updateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  // Upload image to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "avatars",
  });

  // Save new avatar URL
  user.avatar = result.secure_url;
  await user.save();

  res.status(200).json({
    message: "Avatar updated successfully",
    avatar: user.avatar,
  });
});

/* =========================================================
   ✅ Update User Profile (bio, name)
   ========================================================= */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // ✅ Only allow editable fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.bio !== undefined) user.bio = req.body.bio;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt, // ✅ So frontend can show “Joined ...”
    },
  });
});

/* =========================================================
   ✅ Get User Profile
   ========================================================= */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio:
      user.bio ||
      "Hey there! I'm passionate about writing, learning new things, and sharing creative ideas.",
    createdAt: user.createdAt, // ✅ So join date shows correctly
  });
});

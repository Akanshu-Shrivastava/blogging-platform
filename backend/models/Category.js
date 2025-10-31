// models/Category.js
import mongoose from "mongoose";
 
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // ✅ automatically converts "Tech" → "tech"
      unique: true,    // ✅ prevents duplicates
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);

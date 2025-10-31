// models/Tag.js
import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // ✅ normalize
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tag", tagSchema);

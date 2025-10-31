import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URL);

const categories = [
  { name: "Technology" },
  { name: "Lifestyle" },
  { name: "Travel" },
  { name: "Food" },
  { name: "Education" },
];

const seedCategories = async () => {
  try {
    await Category.deleteMany({}); // optional: clears old data
    await Category.insertMany(categories);
    console.log("✅ Categories seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedCategories();

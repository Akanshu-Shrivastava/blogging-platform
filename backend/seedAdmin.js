// backend/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = "admin@gmail.com";

    // check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    // hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    const adminUser = new User({
      name: "admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      avatar: "",
      bio: "I am the first seeded admin",
    });

    await adminUser.save();

    console.log("🎉 Admin seeded successfully:", adminEmail);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();

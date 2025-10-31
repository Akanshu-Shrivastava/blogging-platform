import express from "express";
import { getAllTags } from "../controllers/tagController.js";

const router = express.Router();

// ✅ Public route
router.get("/", getAllTags);

export default router;

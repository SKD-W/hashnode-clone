import express from "express";
import {
  getPublishedPosts,
  getMyPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPublishedPosts);
router.get("/my-posts", protect, getMyPosts);
router.get("/:slug", getPostBySlug);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;

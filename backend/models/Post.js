import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"], // Stores raw Markdown text
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    tags: {
      type: [String], // Normalized lowercase tags, e.g., ['javascript', 'react']
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"], // Restricts value strictly to these two strings
      default: "draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links this field to the 'User' model
      required: true,
    },
    readTime: {
      type: Number, // Estimated reading time in minutes
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", postSchema);

export default Post;

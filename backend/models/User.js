import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Please provide a unique username"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    bio: {
      type: String,
      maxlength: [250, "Bio cannot exceed 250 characters"],
      default: "Developer & technical writer.",
    },
    avatar: {
      type: String,
      default: "", // URL to profile picture (can fallback to initials on frontend)
    },
    techStack: {
      type: [String], // Array of strings, e.g. ['React', 'Node.js', 'MongoDB']
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  },
);

const User = mongoose.model("User", userSchema);

export default User;

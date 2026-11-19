import User from "../models/User.js";
import Post from "../models/Post.js";

// @desc    Get public author profile & their published posts
// @route   GET /api/users/:username
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    }).select("-password -email");

    if (!user) {
      return res.status(404).json({ message: "Author not found" });
    }

    const posts = await Post.find({ author: user._id, status: "published" })
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, bio, avatar, techStack } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (Array.isArray(techStack)) {
      user.techStack = techStack.map((item) => item.trim()).filter(Boolean);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      techStack: updatedUser.techStack,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

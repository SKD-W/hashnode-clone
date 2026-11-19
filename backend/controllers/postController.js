import Post from "../models/Post.js";

// Helper: Create a URL-friendly slug
const createSlug = (title) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Date.now().toString().slice(-4)
  );
};

// Helper: Estimate read time (average 200 words per minute)
const calculateReadTime = (content) => {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Helper: Strip Markdown syntax for clean feed excerpts
const generateExcerpt = (content) => {
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // Remove fenced code blocks
    .replace(/[#*_`>-]/g, "") // Remove Markdown formatting symbols
    .replace(/\s+/g, " ") // Collapse extra whitespace/newlines
    .trim();

  return plainText.length > 150 ? plainText.slice(0, 150) + "..." : plainText;
};

// @desc    Get all published posts (supports ?tag=react and ?search=keyword)
// @route   GET /api/posts
// @access  Public
export const getPublishedPosts = async (req, res) => {
  try {
    const { tag, search } = req.query;

    // Base query: only return published posts on the public feed
    const query = { status: "published" };

    if (tag) {
      query.tags = tag.toLowerCase();
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .populate("author", "name username avatar bio")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's posts (both drafts and published)
// @route   GET /api/posts/my-posts
// @access  Private
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "author",
      "name username avatar bio techStack",
    );

    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new post (draft or published)
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags, status } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const formattedTags = Array.isArray(tags)
      ? tags.map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    const post = await Post.create({
      title,
      slug: createSlug(title),
      content,
      excerpt: excerpt || generateExcerpt(content),
      coverImage: coverImage || "",
      tags: formattedTags,
      status: status || "draft",
      author: req.user._id,
      readTime: calculateReadTime(content),
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post (edit content, tags, or publish a draft)
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check: ensure only the author can edit this post
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    const { title, content, excerpt, coverImage, tags, status } = req.body;

    if (title) post.title = title;
    if (content) {
      post.content = content;
      post.readTime = calculateReadTime(content);
      if (excerpt === undefined) {
        post.excerpt = generateExcerpt(content);
      }
    }
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags) {
      post.tags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    }
    if (status) post.status = status;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

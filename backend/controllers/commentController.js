import Comment from "../models/Comment.js";

// 👉 Create a comment
export const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const newComment = new Comment({
      postId,
      user: req.user.id,
      text,
    });

    let savedComment = await newComment.save();
    savedComment = await savedComment.populate("user", "name avatar");

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👉 Get all comments for a specific post
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👉 Update comment (by user only)
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    comment.text = text || comment.text;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👉 Delete comment (by user only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👉 Admin: Get all comments
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name avatar")
      .populate("postId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👉 Admin: Delete any comment
export const deleteCommentByAdmin = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

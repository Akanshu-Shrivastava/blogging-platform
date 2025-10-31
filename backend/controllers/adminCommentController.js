import Comment from "../models/Comment.js";

export const getAllCommentsAdmin = async (req, res) => {
    try {
      const comments = await Comment.find()
        .populate("user", "name email") // adjust fields based on your User model
        .populate("postId", "title");   // ✅ must match "postId" in schema
  
      res.json(comments);
    } catch (error) {
      console.error("❌ Error in getAllCommentsAdmin:", error.message);
      res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
  };
    
  // DELETE any comment (Admin only)    
  export const deleteCommentAdmin = async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      await comment.deleteOne();
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment" });
    }
  };
  
  // UPDATE any comment (Admin only)
  export const updateCommentAdmin = async (req, res) => {
    try {
      const { text } = req.body;
      const comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      comment.text = text || comment.text;
      await comment.save();
  
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error updating comment" });
    }
  };
  
  
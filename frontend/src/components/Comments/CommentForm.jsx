// components/Comments/CommentForm.jsx
import { useState } from "react";
import { BlogAPI } from "../../api/axios";

const CommentForm = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // JWT token
      await BlogAPI.postComment(postId, { text }, token);
      setText("");
      if (onCommentAdded) onCommentAdded(); // refresh comments
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows={3}
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-1 bg-blue-500 text-white rounded"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentForm;

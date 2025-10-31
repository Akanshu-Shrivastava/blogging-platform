// components/Comments/CommentList.jsx
import { useEffect, useState } from "react";
import { BlogAPI } from "../../api/axios";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await BlogAPI.getComments(postId);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (loading) return <p>Loading comments...</p>;
  if (!comments.length) return <p>No comments yet. Be the first!</p>;

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c._id} className="border-b p-2">
          <p className="font-bold">{c.userId?.username || "Unknown"}</p>{" "}
          {/* <--- fix here */}
          <p>{c.text}</p>
          <p className="text-xs text-gray-500">
            {new Date(c.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;

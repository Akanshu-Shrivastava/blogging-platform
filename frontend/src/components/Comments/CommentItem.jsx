import { useDispatch, useSelector } from "react-redux";
import { deleteComment, updateComment } from "../../features/comments/commentSlice";
import { useState } from "react";

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  const handleUpdate = () => {
    dispatch(updateComment({ id: comment._id, text }));
    setIsEditing(false);
  };

  return (
    <div className="border p-3 rounded-lg bg-gray-100">
      <p className="font-semibold">{comment.user.username}</p>
      {isEditing ? (
        <div className="flex gap-2">
          <input
            className="border p-1 rounded flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleUpdate} className="text-blue-600">Save</button>
        </div>
      ) : (
        <p>{comment.text}</p>
      )}

      {user && user._id === comment.user._id && (
        <div className="mt-2 space-x-3">
          <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-yellow-600">
            Edit
          </button>
          <button onClick={() => dispatch(deleteComment(comment._id))} className="text-sm text-red-600">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;

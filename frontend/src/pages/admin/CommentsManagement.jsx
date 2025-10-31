import { useEffect, useState } from "react";
import { AdminAPI } from "../../api/axios";

const CommentsManagement = ({ onCommentChange, onStatsUpdate }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await AdminAPI.getAllComments();
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    
    try {
      setDeletingId(commentToDelete._id);
      await AdminAPI.deleteComment(commentToDelete._id);
      setComments(comments.filter((c) => c._id !== commentToDelete._id));
      
      // Notify dashboard of comment count change
      if (onCommentChange) onCommentChange(-1);
      if (onStatsUpdate) onStatsUpdate();
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setCommentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setCommentToDelete(null);
  };

  const handleRefresh = async () => {
    await fetchComments();
    // Also trigger stats update in dashboard
    if (onStatsUpdate) onStatsUpdate();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Comments</h2>
              <p className="text-gray-600">Review and manage user comments across your platform</p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 ease-in-out flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          /* Comments List */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {comments.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  There are no comments to display at the moment.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {comments.map((comment, index) => (
                  <li
                    key={comment._id}
                    className="p-6 hover:bg-gray-50 transition-all duration-200 ease-in-out"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: `slideInUp 0.3s ease-out ${index * 50}ms both`
                    }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {comment.user?.name || "Unknown User"}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                          <p className="text-gray-800 leading-relaxed">{comment.text}</p>
                        </div>

                        {comment.post && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>On: {comment.post.title || "Untitled Post"}</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDeleteClick(comment)}
                        disabled={deletingId === comment._id}
                        className={`
                          px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ease-in-out
                          transform hover:scale-105 active:scale-95 flex-shrink-0
                          ${deletingId === comment._id 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm hover:shadow-md'
                          }
                        `}
                      >
                        {deletingId === comment._id ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Deleting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Stats Footer */}
        {!isLoading && comments.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
            <span>Total comments: {comments.length}</span>
            <span>Sorted by latest</span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && commentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform animate-scaleIn">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Delete Comment</h3>
            </div>
            
            <p className="text-gray-600 mb-2">Are you sure you want to delete this comment?</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {commentToDelete.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="font-medium text-gray-800 text-sm">
                  {commentToDelete.user?.name || "Unknown User"}
                </span>
              </div>
              <p className="text-gray-700 text-sm">"{commentToDelete.text}"</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId === commentToDelete._id}
                className={`
                  px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 ease-in-out
                  flex items-center space-x-2
                  ${deletingId === commentToDelete._id
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 transform hover:scale-105 active:scale-95'
                  }
                `}
              >
                {deletingId === commentToDelete._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CommentsManagement;
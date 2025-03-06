'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash, Reply } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchComments,
  postComment,
  editComment,
  deleteComment,
} from '@/store/slices/commentSlice';

interface Product {
  _id: string;
}

interface SellerInteractionProps {
  product: Product;
  userId: string;
}

const SellerInteraction: React.FC<SellerInteractionProps> = ({
  product,
  userId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading } = useSelector(
    (state: RootState) => state.comments
  );

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    if (product._id) {
      dispatch(fetchComments(product._id));
    }
  }, [dispatch, product._id]);

  const handlePostComment = async (parentCommentId?: string) => {
    if (!userId || !token) return;

    if ((newComment.trim() || replyText.trim()) && product._id) {
      await dispatch(
        postComment({
          productId: product._id,
          userId,
          content: parentCommentId ? replyText : newComment,
          parentCommentId,
          token,
        })
      );
      setNewComment('');
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editingComment || !editingComment.text.trim()) return; // Ensure it's not null
    await dispatch(
      editComment({
        commentId,
        content: editingComment.text,
        token: token || '',
      })
    );
    setEditingComment(null);
  };

  const handleDeleteComment = async (commentId: string) => {
    await dispatch(deleteComment({ commentId, token: token || '' }));
  };

  return (
    <div className="mt-12 max-w-3xl mx-auto">
      {/* Comment Input */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Discussion</h2>
        <div className="bg-white rounded-lg shadow-sm">
          <textarea
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 resize-none"
            rows={4}
            placeholder="Share your thoughts about this product..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end p-2 bg-gray-50 rounded-b-lg">
            <button
              onClick={() => handlePostComment()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div
            key={comment._id || `comment-${index}`}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">
                    {comment.userId?.name || 'Anonymous'}
                  </span>
                  {comment.userId?._id === userId && (
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      You
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {editingComment?.id === comment._id ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={3}
                      value={editingComment?.text || ''}
                      onChange={(e) =>
                        setEditingComment({
                          id: comment._id,
                          text: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{comment.content}</p>
                )}
              </div>

              {comment.userId?._id === userId && !editingComment && (
                <div className="flex gap-3 ml-4">
                  <button
                    onClick={() =>
                      setEditingComment({
                        id: comment._id,
                        text: comment.content,
                      })
                    }
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Reply Section */}
            <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-100">
              <button
                onClick={() => setReplyingTo({ id: comment._id })}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 mt-2"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>

              {replyingTo?.id === comment._id && (
                <div className="mt-3 space-y-2">
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={2}
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePostComment(comment._id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Post reply
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies?.map((reply) => (
                <div key={reply._id} className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {reply.userId?.name || 'Anonymous'}
                    </span>
                    {reply.userId?._id === userId && (
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{reply.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerInteraction;

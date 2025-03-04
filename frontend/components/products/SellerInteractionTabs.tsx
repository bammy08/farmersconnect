'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageSquareText,
  Phone,
  MessageCircle,
  Pencil,
  Trash,
} from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchComments,
  postComment,
  editComment,
  deleteComment,
} from '@/store/slices/commentSlice';

interface SellerProfile {
  phone?: string;
}

interface Seller {
  sellerProfile?: SellerProfile | string | boolean;
  _id: string;
  name?: string;
  email?: string;
}

interface Product {
  _id: string;
  seller?: string | Seller;
}

interface SellerInteractionTabsProps {
  product: Product;
  userId: string;
}

const SellerInteractionTabs: React.FC<SellerInteractionTabsProps> = ({
  product,
  userId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading } = useSelector(
    (state: RootState) => state.comments
  );

  const [activeTab, setActiveTab] = useState<'comment' | 'call' | 'chat'>(
    'comment'
  );
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // ✅ Get token once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // ✅ Fetch comments only when product ID changes
  useEffect(() => {
    if (product._id) {
      dispatch(fetchComments(product._id));
    }
  }, [dispatch, product._id]);

  const handlePostComment = async (parentCommentId?: string) => {
    if (!userId) {
      console.error('Error: userId is missing!');
      return;
    }
    console.log('Sending comment data:', {
      productId: product._id,
      userId,
      content: parentCommentId ? replyText : newComment,
      parentCommentId,
      token,
    });

    if ((newComment.trim() || replyText.trim()) && product._id && token) {
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
    if (editingComment?.text.trim()) {
      await dispatch(
        editComment({
          commentId,
          content: editingComment.text,
          token: token || '',
        })
      );
      setEditingComment(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await dispatch(deleteComment({ commentId, token: token || '' }));
  };

  return (
    <div className="mt-10 p-2 rounded-lg">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 bg-white">
          {[
            { id: 'comment', label: 'Leave Comment', icon: MessageSquareText },
            { id: 'call', label: 'Call Seller', icon: Phone },
            { id: 'chat', label: 'Chat', icon: MessageCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'comment' | 'call' | 'chat')}
              className={`py-2 px-4 border-b-2 font-medium flex items-center gap-2 ${
                activeTab === id
                  ? 'border-green-500 bg-green-400 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'comment' && (
          <div className="space-y-4">
            {/* Comment Input */}
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              rows={4}
              placeholder="Write your comment about the product..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={() => handlePostComment()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>

            {/* Comments List */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Comments</h3>
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-3 border rounded-lg bg-gray-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      {comment.userId?.name || 'Anonymous'}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                  {comment.userId?._id === userId && (
                    <div className="flex gap-2">
                      {editingComment?.id === comment._id ? (
                        <div className="mt-2">
                          <textarea
                            className="w-full p-2 border rounded"
                            rows={2}
                            value={editingComment.text}
                            onChange={(e) =>
                              setEditingComment({
                                id: comment._id,
                                text: e.target.value,
                              })
                            }
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleEditComment(comment._id)}
                              className="bg-blue-500 text-white px-4 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingComment(null)}
                              className="bg-gray-400 text-white px-4 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setEditingComment({
                              id: comment._id,
                              text: comment.content,
                            })
                          }
                        >
                          <Pencil />
                        </button>
                      )}

                      <button onClick={() => handleDeleteComment(comment._id)}>
                        <Trash />
                      </button>
                    </div>
                  )}
                  <button onClick={() => setReplyingTo({ id: comment._id })}>
                    Reply
                  </button>

                  {/* Reply Input */}
                  {replyingTo?.id === comment._id && (
                    <div className="mt-2 ml-4">
                      <textarea
                        className="w-full p-2 border rounded"
                        rows={2}
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <button
                        onClick={() => handlePostComment(comment._id)}
                        className="mt-1 bg-blue-500 text-white px-4 py-1 rounded"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Display Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 pl-4 border-l border-gray-300">
                      <h4 className="text-sm font-semibold">Replies</h4>
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="p-2 border rounded-lg bg-gray-50 mt-2"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">
                              {reply.userId?.name || 'Anonymous'}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInteractionTabs;

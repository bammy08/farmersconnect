import Comment from '../models/Comment.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js'; // Ensure Notification model is imported

/** @desc Add a new comment or reply */
export const addComment = async (req, res) => {
  try {
    const { productId, content, parentCommentId } = req.body;
    const userId = req.user._id;
    const io = req.io; // ✅ Get io from request object

    if (!productId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newComment = new Comment({
      productId,
      userId,
      content,
      parentCommentId: parentCommentId || null,
    });

    await newComment.save();

    let recipientUserId = null;
    let message = '';

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        recipientUserId = parentComment.userId;
        message = `Someone replied to your comment: "${content}"`;
      }
    } else {
      const product = await Product.findById(productId);
      if (product) {
        recipientUserId = product.seller;
        message = `New comment on your product: "${content}"`;
      }
    }

    if (recipientUserId && recipientUserId.toString() !== userId.toString()) {
      const notification = new Notification({
        recipient: recipientUserId,
        message,
        type: 'comment',
      });

      await notification.save();

      // ✅ Emit real-time notification using `req.io`
      const recipientSocket = req.io.onlineUsers.get(
        recipientUserId.toString()
      );
      if (recipientSocket) {
        io.to(recipientSocket).emit('newNotification', {
          message: notification.message,
          type: 'comment',
        });
      }
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

/** @desc Edit a comment */
export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to edit this comment' });
    }

    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ message: 'Error editing comment' });
  }
};

/** @desc Delete a comment */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(id);
    await Comment.deleteMany({ parentCommentId: id }); // Delete replies too

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

/** @desc Get comments and replies for a product */
export const getComments = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch top-level comments (parentCommentId is null)
    const comments = await Comment.find({ productId, parentCommentId: null })
      .populate('userId', 'name')
      .sort({ createdAt: -1 }) // Show newest comments first
      .lean();

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentCommentId: comment._id })
          .populate('userId', 'name')
          .sort({ createdAt: 1 }) // Show oldest replies first
          .lean();
        return { ...comment, replies };
      })
    );

    res.status(200).json(commentsWithReplies);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

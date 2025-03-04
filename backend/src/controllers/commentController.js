import Comment from '../models/Comment.js';

/** @desc Add a new comment or reply */
export const addComment = async (req, res) => {
  try {
    const { productId, userId, content, parentCommentId } = req.body;

    if (!productId || !userId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newComment = new Comment({
      productId,
      userId: req.user._id,
      content,
      parentCommentId: parentCommentId || null, // Default to null if not provided
    });

    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res
      .status(500)
      .json({ message: 'Error adding comment', error: error.message });
  }
};

/** @desc Edit a comment */
export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to edit this comment' });
    }

    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error editing comment' });
  }
};

/** @desc Delete a comment */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(id);
    await Comment.deleteMany({ parentCommentId: id }); // Delete replies too

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
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
        console.log(`Replies for comment ${comment._id}:`, replies);
        return { ...comment, replies };
      })
    );

    res.status(200).json(commentsWithReplies);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

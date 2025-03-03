import Comment from '../models/Comment.js';

/** @desc Add a new comment or reply */
export const addComment = async (req, res) => {
  const { productId, content, parentCommentId } = req.body; // ✅ Read from body
  if (!productId || !content) {
    return res
      .status(400)
      .json({ message: 'Product ID and content are required' });
  }

  try {
    const comment = await Comment.create({
      productId,
      userId: req.user._id,
      content,
      parentComment: parentCommentId || null,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
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

    const comments = await Comment.find({ productId, parentCommentId: null })
      .populate({ path: 'userId', select: 'name' }) // ✅ Populate user name
      .sort({ createdAt: -1 })
      .lean();

    for (let comment of comments) {
      comment.replies = await Comment.find({ parentCommentId: comment._id })
        .populate({ path: 'userId', select: 'name' })
        .lean();
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

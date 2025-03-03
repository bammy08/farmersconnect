import express from 'express';
import {
  addComment,
  deleteComment,
  editComment,
  getComments,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addComment); // ✅ Add comment with productId
router.get('/:productId', getComments); // Get comments for a product
router.put('/:id', protect, editComment);
router.delete('/:id', protect, deleteComment);

export default router;

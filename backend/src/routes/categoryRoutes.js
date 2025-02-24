import express from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), createCategory); // Create
router.get('/', getCategories); // Get all
router.get('/:id', getCategory); // Get one
router.put('/:id', protect, admin, upload.single('image'), updateCategory); // Update
router.delete('/:id', protect, admin, deleteCategory); // Delete

export default router;

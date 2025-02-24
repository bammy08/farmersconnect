import express from 'express';
import { protect, admin, sellerOnly } from '../middleware/authMiddleware.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// 📌 Routes
router.post(
  '/create',
  protect,
  sellerOnly,
  upload.array('images', 5),
  createProduct
);
router.get('/', getProducts); // Admin sees all, seller sees only their own
router.get('/:id', getProductById);
router.put(
  '/:id',
  protect,
  sellerOnly,
  upload.array('images', 5),
  updateProduct
);
router.delete(
  '/:id',
  protect,
  (req, res, next) => {
    if (req.user.role === 'admin') {
      return next(); // ✅ Admins can delete any product
    } else if (req.user.role === 'seller') {
      return sellerOnly(req, res, next); // ✅ Sellers delete their own products
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  },
  deleteProduct
);

export default router;

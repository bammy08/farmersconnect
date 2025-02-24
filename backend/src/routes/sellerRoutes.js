import express from 'express';
import {
  getSellerProfile,
  completeSellerProfile,
  updateSellerProfile,
} from '../controllers/sellerController.js';
import { protect } from '../middleware/authMiddleware.js'; // ✅ Protect routes

const router = express.Router();

// ✅ Route to get the seller profile
router.get('/profile', protect, getSellerProfile);

// ✅ Route to complete onboarding
router.post('/onboarding', protect, completeSellerProfile);

// ✅ Update seller profile
router.put('/profile', protect, updateSellerProfile);

export default router;

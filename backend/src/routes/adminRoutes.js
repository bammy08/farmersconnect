import express from 'express';
import {
  getUsers,
  getSellerProfiles,
  approveSeller,
  rejectSeller,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Protect route with admin middleware

const router = express.Router();

// Admin routes (requires admin permission)
router.get('/users', protect, admin, getUsers); // Get all users
router.get('/sellers', protect, admin, getSellerProfiles); // Get all seller profiles
router.put('/sellers/approve/:sellerId', protect, admin, approveSeller); // Approve seller profile
router.delete('/sellers/reject/:sellerId', protect, admin, rejectSeller); // Reject seller profile
router.delete('/users/:userId', protect, admin, deleteUser); // Delete user

export default router;

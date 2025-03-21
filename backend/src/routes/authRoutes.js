import express from 'express';
import {
  registerUser,
  registerSeller,
  loginUser,
  verifySeller,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-seller', registerSeller);
router.post('/login', loginUser);
router.get('/verify/:token', verifySeller);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;

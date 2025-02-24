import express from 'express';
import {
  registerUser,
  registerSeller,
  loginUser,
  verifySeller,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-seller', registerSeller);
router.post('/login', loginUser);
router.get('/verify/:token', verifySeller);
export default router;

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  console.log('🚀 Received Headers:', req.headers);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Received Token:', token); // ✅ Debugging log

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // ✅ Debugging log

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next(); // ✅ Ensure it moves to the next middleware
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  console.log('No token provided in request headers');
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Restrict routes to admins only
export const admin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: 'Not authorized, missing user data' });
  }

  if (req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
};

export const sellerOnly = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied. Sellers only' });
  }
  next();
};

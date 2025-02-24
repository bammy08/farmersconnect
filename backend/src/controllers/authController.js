import User from '../models/User.js';
import SellerProfile from '../models/SellerProfile.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// 📌 Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// 📌 Register Seller (Requires Email Verification)
export const registerSeller = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 🔍 Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📌 Generate email verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // 📧 Send verification email BEFORE creating the seller
    const emailSent = await sendVerificationEmail(email, token);
    if (!emailSent) {
      return res
        .status(500)
        .json({ message: 'Error sending verification email' });
    }

    // ✅ Save user
    const seller = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'seller',
      isVerified: false,
      verificationToken: token,
    });

    // ✅ Save SellerProfile and link it to the user
    const sellerProfile = await SellerProfile.create({
      user: seller._id, // ✅ Linking user
      email,
      isOnboarded: false,
      isApproved: false,
    });

    // ✅ Update User with SellerProfile ID
    seller.sellerProfile = sellerProfile._id;
    await seller.save();

    res
      .status(201)
      .json({ message: 'Seller registered! Please verify your email.' });
  } catch (error) {
    console.error('Register Seller Error:', error);
    res.status(500).json({ message: 'Error registering seller', error });
  }
};

// 📌 Verify Seller
export const verifySeller = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.isVerified = true;
    await user.save();

    // ✅ Generate JWT Token after verification
    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Email verified successfully!',
      token: authToken, // ✅ Send the token in response
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// 📌 Login User or Seller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Find user in the User collection (this includes sellers!)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 🔑 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 🔥 Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Get seller profile if the user is a seller
    let sellerProfile = null;
    if (user.role === 'seller') {
      sellerProfile = await SellerProfile.findOne({ user: user._id }).lean(); // Convert to plain object
    }

    // ✅ Ensure `_id` is explicitly sent as `id`
    res.json({
      token,
      user: {
        id: user._id.toString(), // Convert `_id` to string for consistency
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        sellerProfile, // Include seller profile if available
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

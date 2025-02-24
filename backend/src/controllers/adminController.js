import SellerProfile from '../models/SellerProfile.js';
import User from '../models/User.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate({
        path: 'sellerProfile',
        select:
          'isApproved isOnboarded businessName businessAddress phone state lga',
        strictPopulate: false, // ✅ Ensures population works even if missing
      })
      .lean(); // ✅ Convert to plain JSON for debugging

    console.log('✅ Populated Users:', users); // Debugging

    res.status(200).json(users);
  } catch (error) {
    console.error('🚨 Error fetching users:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Get all seller profiles
export const getSellerProfiles = async (req, res) => {
  try {
    const sellerProfiles = await SellerProfile.find();
    res.status(200).json(sellerProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seller profiles' });
  }
};

// Approve seller
export const approveSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log('🔍 Received sellerId:', sellerId);

    const sellerProfile = await SellerProfile.findOneAndUpdate(
      { user: sellerId }, // Search by user ID instead of _id
      { isApproved: true },
      { new: true }
    );

    if (!sellerProfile) {
      console.log('❌ Seller profile not found in DB');
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    res.status(200).json({ message: 'Seller profile approved', sellerProfile });
  } catch (error) {
    console.error('🔥 Error approving seller:', error);
    res.status(500).json({ message: 'Error approving seller profile' });
  }
};

// Reject seller
export const rejectSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const sellerProfile = await SellerProfile.findByIdAndDelete(sellerId);
    if (!sellerProfile)
      return res.status(404).json({ message: 'Seller profile not found' });

    res.status(200).json({ message: 'Seller profile rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting seller profile' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

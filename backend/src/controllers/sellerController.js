import SellerProfile from '../models/SellerProfile.js';
import User from '../models/User.js'; // ✅ Import User model to check verification

// ✅ Get seller profile
export const getSellerProfile = async (req, res) => {
  try {
    const sellerProfile = await SellerProfile.findOne({ user: req.user._id });

    if (!sellerProfile) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    res.json(sellerProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Complete onboarding
export const completeSellerProfile = async (req, res) => {
  try {
    const { businessName, businessAddress, phone, state, lga } = req.body;

    // ✅ Check if the user is verified before onboarding
    const user = await User.findById(req.user._id);
    if (!user || !user.isVerified) {
      return res
        .status(403)
        .json({ message: 'Please verify your email first.' });
    }

    // ✅ Find seller profile
    const sellerProfile = await SellerProfile.findOne({ user: req.user._id });

    if (!sellerProfile) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    // ✅ Update profile fields
    sellerProfile.businessName = businessName;
    sellerProfile.businessAddress = businessAddress;
    sellerProfile.phone = phone;
    sellerProfile.state = state;
    sellerProfile.lga = lga;
    sellerProfile.isOnboarded = true;

    await sellerProfile.save(); // ✅ Fix: Save the instance correctly

    res.json({ message: 'Onboarding complete' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update seller profile
export const updateSellerProfile = async (req, res) => {
  try {
    const { businessName, businessAddress, phone, state, lga } = req.body;

    // Find the seller profile
    let sellerProfile = await SellerProfile.findOne({ user: req.user._id });

    if (!sellerProfile) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    // Update only the provided fields
    if (businessName) sellerProfile.businessName = businessName;
    if (businessAddress) sellerProfile.businessAddress = businessAddress;
    if (phone) sellerProfile.phone = phone;
    if (state) sellerProfile.state = state;
    if (lga) sellerProfile.lga = lga;

    await sellerProfile.save();

    res.json({ message: 'Profile updated successfully', sellerProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

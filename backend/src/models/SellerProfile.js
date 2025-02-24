import mongoose from 'mongoose';

const sellerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Link to the User model
      required: true,
    },
    email: { type: String, required: true, unique: true },
    businessName: { type: String, required: false },
    businessAddress: { type: String, required: false },
    phone: { type: String, required: false },
    state: { type: String, required: false },
    lga: { type: String, required: false },
    isApproved: { type: Boolean, default: false },
    isOnboarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SellerProfile = mongoose.model('SellerProfile', sellerProfileSchema);
export default SellerProfile;

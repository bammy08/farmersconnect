import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'seller', 'user'], required: true },
    isVerified: { type: Boolean, default: false },
    sellerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerProfile',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

export type SellerProfile = {
  _id: string;
  email: string;
  isApproved: boolean;
  isOnboarded: boolean;
  businessName?: string;
  businessAddress?: string;
  phone?: string;
  state?: string;
  lga?: string;
};

export type User = {
  _id: string;
  id?: string; // ✅ Optional alias for `id` (some APIs return `id` instead of `_id`)
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'user';
  isVerified: boolean;
  sellerProfile?: SellerProfile;
};

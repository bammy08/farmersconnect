import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    bulkPricing: [
      {
        minQuantity: {
          type: Number,
          required: true,
          enum: [5, 10, 15, 20, 30, 40, 50],
        },
        price: { type: Number, required: true }, // Discounted price for that quantity
      },
    ],
    quantity: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    state: { type: String, required: true },
    lga: { type: String, required: true },
    images: [{ type: String, required: true }], // Cloudinary URLs
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

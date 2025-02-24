import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // Stores the Cloudinary URL
      default: '',
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Relation to products
  },
  { timestamps: true }
);

export default mongoose.model('Category', CategorySchema);

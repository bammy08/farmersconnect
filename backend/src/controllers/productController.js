import cloudinary from '../config/cloudinary.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
/**
 * @desc Create a new product (Only Sellers)
 * @route POST /api/products/create
 * @access Private (Sellers Only)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      bulkPricing,
      quantity,
      category,
      state,
      lga,
      seller,
    } = req.body;

    if (!req.user || req.user.role !== 'seller') {
      return res
        .status(403)
        .json({ success: false, message: 'Only sellers can create products' });
    }

    // Extract multiple image URLs from Cloudinary
    const images = req.files.map((file) => file.path);

    const product = new Product({
      name,
      description,
      price,
      bulkPricing: JSON.parse(bulkPricing), // Parse the JSON string into an array
      quantity,
      category,
      state,
      lga,
      images,
      seller: req.user.id, // Ensure seller ID is from authenticated user
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all products (Admin can fetch all, sellers can only see theirs)
 * @route GET /api/products
 * @access Private (Admin & Sellers)
 */
export const getProducts = async (req, res) => {
  try {
    let query = {}; // Default: fetch all products (for public users)

    if (req.user) {
      if (req.user.role === 'seller') {
        query.seller = req.user.id; // Sellers see only their own products
      }
      // Admins see all products, so no need to modify query
    }

    const products = await Product.find(query).populate(
      'category seller',
      'name email'
    );

    res.json({ success: true, products });
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get a single product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category seller',
      'name email'
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update product (Only the seller who created it)
 * @route PUT /api/products/:id
 * @access Private (Sellers Only)
 */
export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Debug incoming request body
    console.log('🔍 Debugging req.body:', req.body);

    const { existingImages, ...updatedFields } = req.body;

    // Ensure `seller` is not mistakenly included
    delete updatedFields.seller;

    // Handle images correctly
    const parsedExistingImages = existingImages
      ? JSON.parse(existingImages)
      : [];
    const newUploadedImages = req.files?.map((file) => file.path) || [];
    updatedFields.images = [...parsedExistingImages, ...newUploadedImages];

    // Validate and parse bulkPricing
    if (
      updatedFields.bulkPricing &&
      typeof updatedFields.bulkPricing === 'string'
    ) {
      try {
        updatedFields.bulkPricing = JSON.parse(updatedFields.bulkPricing);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid bulkPricing format' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete product (Seller can delete their own, Admin can delete any)
 * @route DELETE /api/products/:id
 * @access Private (Sellers & Admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    if (
      req.user.role !== 'admin' &&
      product.seller.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

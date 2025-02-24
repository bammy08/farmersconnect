import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';

// ✅ Create a new category (Admin only)

export const createCategory = async (req, res) => {
  try {
    console.log('🔍 Received Body:', req.body);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create category with image URL directly
    const category = await Category.create({
      name,
      description,
      image, // Image URL from Cloudinary
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get a single category
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, image } = req.body; // ✅ Get image from request body

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // ✅ Allow updating image from frontend payload (Cloudinary URL)
    if (image) {
      category.image = image;
    } else if (req.file) {
      // ✅ Handle file upload case
      if (category.image) {
        const imageId = category.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`categories/${imageId}`);
      }
      category.image = req.file.path;
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Check if the request is for products or categories
    const folder = req.baseUrl.includes('products') ? 'products' : 'categories';

    return {
      folder,
      format: file.mimetype.split('/')[1], // Extract file format dynamically
      transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional resizing
    };
  },
});

const upload = multer({ storage });

export default upload;

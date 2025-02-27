import Product from '../models/Product.js'; // Your product model

export const searchProducts = async (req, res) => {
  try {
    const { query, state, lga, category, minPrice, maxPrice, sortBy } =
      req.query;

    let filter = {};

    // Search by product name
    if (query) {
      filter.name = { $regex: query, $options: 'i' }; // Case-insensitive search
    }

    // Filter by state (only if it's not "all")
    if (state && state !== 'all') {
      filter.state = state;
    }

    // Filter by LGA
    if (lga) {
      filter.lga = lga;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    // Sorting logic
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sort.price = 1;
          break;
        case 'price_desc':
          sort.price = -1;
          break;
        case 'name_asc':
          sort.name = 1;
          break;
        case 'name_desc':
          sort.name = -1;
          break;
        default:
          sort.createdAt = -1; // Default sorting
      }
    }

    // Fetch products from MongoDB
    const products = await Product.find(filter).sort(sort);

    res.status(200).json(products);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

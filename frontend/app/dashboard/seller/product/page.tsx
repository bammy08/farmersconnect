'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  deleteProduct,
  Product,
} from '@/store/slices/productSlice';
import ProductForm from '@/components/products/ProductForm';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import CustomSheet from '@/components/CustomSheet';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch products and authentication state from Redux
  const {
    products = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.products);
  const { isAuthenticated, user, token } = useSelector(
    (state: RootState) => state.auth
  );

  const typedUser = user ? { ...user, _id: user._id || user.id || '' } : null;

  // State to control sheet visibility and deletion confirmation
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchProducts({ token }));
    }
  }, [dispatch, isAuthenticated, token]);

  // Filter products: Sellers only see their own products
  const filteredProducts =
    typedUser?.role === 'seller'
      ? products.filter(
          (product) =>
            product.seller &&
            (typeof product.seller === 'string'
              ? product.seller === typedUser._id
              : product.seller._id === typedUser._id)
        )
      : products;

  const handleDelete = async () => {
    if (!token || !productToDelete) return;
    try {
      await dispatch(
        deleteProduct({ productId: productToDelete, token })
      ).unwrap();
      dispatch(fetchProducts({ token })); // Refresh product list after deletion
    } catch (err) {
      console.error('Error deleting product:', err);
    }
    setIsDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

      {/* Button to open the sheet for adding a new product */}
      {isAuthenticated && token && (
        <>
          <Button onClick={() => setIsSheetOpen(true)} className="mb-4">
            Add New Product
          </Button>

          {/* CustomSheet for adding/editing products */}
          <CustomSheet
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            width="50%"
          >
            <h2 className="text-xl font-bold mb-4">
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              existingProduct={selectedProduct}
              token={token}
              onSuccess={() => {
                dispatch(fetchProducts({ token }));
                setIsSheetOpen(false);
              }}
            />
          </CustomSheet>
        </>
      )}

      {/* Product List Table */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredProducts.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-300 p-2 w-12 text-center">
                  #
                </th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Price ($)</th>
                <th className="border border-gray-300 p-2">Location</th>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id || index} className="text-left">
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">{product.name}</td>
                  <td className="border border-gray-300 p-2">
                    {product.description}
                  </td>
                  <td className="border border-gray-300 p-2">
                    ${product.price}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.state}, {product.lga}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {typeof product.category === 'string'
                      ? product.category
                      : (product.category as { name?: string })?.name ||
                        'Unknown'}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {isAuthenticated && typedUser ? (
                      typedUser.role === 'admin' ||
                      (product.seller &&
                        (typeof product.seller === 'string'
                          ? product.seller === typedUser._id
                          : product.seller._id === typedUser._id)) ? (
                        <>
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Edit
                          </button>

                          {/* Delete Confirmation Dialog */}
                          <AlertDialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                          >
                            <AlertDialogTrigger asChild>
                              <button
                                onClick={() => {
                                  setProductToDelete(product._id);
                                  setIsDialogOpen(true);
                                }}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                              >
                                Delete
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the product.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={() => setIsDialogOpen(false)}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      ) : (
                        <span className="text-gray-400">No Actions</span>
                      )
                    ) : (
                      <span className="text-gray-400">No Actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductsPage;

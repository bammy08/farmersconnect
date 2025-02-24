'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '@/store/slices/productSlice';
import { AppDispatch, RootState } from '@/store/store';
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

  // ✅ State to track the product being deleted
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // ✅ Fetch products and authentication state from Redux
  const {
    products = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.products);
  const { isAuthenticated, user, token } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchProducts({ token }));
    }
  }, [dispatch, isAuthenticated, token]);

  // ✅ Handle Delete Action
  const confirmDelete = async () => {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length > 0 ? (
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
                <th className="border border-gray-300 p-2">Seller</th>
                <th className="border border-gray-300 p-2">Location</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id} className="text-left">
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
                    {typeof product.seller === 'object'
                      ? product.seller.name || product.seller.email
                      : product.seller || 'N/A'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.state}, {product.lga}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {isAuthenticated &&
                    user &&
                    (user.role === 'admin' || product.seller === user._id) ? (
                      <>
                        {/* ✅ Open Dialog and Set Product ID Before Deleting */}
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

                          {/* ✅ Delete Confirmation Dialog */}
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the product.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => {
                                  setIsDialogOpen(false);
                                  setProductToDelete(null);
                                }}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
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

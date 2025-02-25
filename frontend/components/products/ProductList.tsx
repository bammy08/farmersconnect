import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { fetchProducts } from '@/store/slices/productSlice';
import { RootState, AppDispatch } from '@/store/store';
import { Product } from '@/store/slices/productSlice';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    const token = localStorage.getItem('token') || undefined;
    dispatch(fetchProducts({ token }));
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg font-medium">⚠️ {error}</p>
      </div>
    );

  return (
    <div className="w-full bg-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-100">
                  {product.images?.length ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    <span className="font-medium">
                      {product.state}, {product.lga}
                    </span>
                    {/* <span className="text-gray-300">,</span>
                  <span>{product.lga}</span> */}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-600">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        console.log('🛠 Navigating to product:', product._id); // Debugging the product ID
                        router.push(`/products/${product._id}`);
                      }}
                      className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

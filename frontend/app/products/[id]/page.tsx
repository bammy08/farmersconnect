/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '@/store/slices/productSlice';
import { AppDispatch, RootState } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquareText,
  Phone,
  MessageCircle,
  Mail,
  ArrowRight,
} from 'lucide-react';
import SellerInteractionTabs from '@/components/products/SellerInteractionTabs';

// TypeScript interfaces
interface BulkPricing {
  _id?: string;
  minQuantity: number;
  price: number;
}

interface Category {
  _id?: string;
  name?: string;
}

interface SellerProfile {
  businessName: string;
  phone: string;
}

interface Seller {
  _id: string;
  name?: string;
  email?: string;
  sellerProfile?: SellerProfile;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  bulkPricing?: BulkPricing[];
  quantity: number;
  category?: Category | string;
  state: string;
  lga: string;
  images?: string[];
  seller?: Seller;
  createdAt: string;
  updatedAt: string;
}

const ProductDetail = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'comment' | 'call' | 'chat'>(
    'comment'
  );
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const dispatch = useDispatch<AppDispatch>();
  const { product, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  if (!product) return <p className="text-center mt-8">No product found.</p>;

  console.log('Category:', product.category);

  return (
    <div className="w-full bg-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="space-y-4 bg-white">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              {product.images?.length > 0 && (
                <Image
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeImageIndex
                      ? 'border-green-500 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <hr />

            <SellerInteractionTabs product={product} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                {product.description}
              </p>
            </div>

            <div className="bg-white shadow-md p-4 rounded-lg">
              <p className="text-4xl font-bold text-gray-900">
                ₦{product.price.toLocaleString()}
                <span className="text-lg font-normal text-gray-500 ml-2">
                  /unit
                </span>
              </p>

              {product.bulkPricing?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Volume Discount
                  </h3>
                  <div className="mt-2 space-y-2">
                    {product.bulkPricing.map((bulk, index) => (
                      <div
                        key={bulk._id || index}
                        className="flex justify-between"
                      >
                        <span>Buy {bulk.minQuantity}+ units</span>
                        <span className="font-medium">₦{bulk.price}/unit</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <span className="text-gray-700">Available Quantity:</span>
                <span className="ml-2 font-medium">
                  {product.quantity} units
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-700">Category:</span>
                <span className="ml-2 font-medium">
                  {product.category &&
                  typeof product.category === 'object' &&
                  'name' in product.category
                    ? (product.category as Category).name
                    : 'N/A'}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-700">Location:</span>
                <span className="ml-2 font-medium">
                  {product.state}, {product.lga}
                </span>
              </div>
            </div>

            {product.seller &&
              typeof product.seller === 'object' &&
              'sellerProfile' in product.seller &&
              product.seller.sellerProfile &&
              typeof product.seller.sellerProfile === 'object' && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-start gap-4">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                        {(product.seller.sellerProfile as SellerProfile)
                          .businessName
                          ? (
                              product.seller.sellerProfile as SellerProfile
                            ).businessName
                              .split(' ')
                              .map((word) => word.charAt(0).toUpperCase())
                              .join('')
                          : product.seller.name
                              ?.split(' ')
                              .map((word) => word.charAt(0).toUpperCase())
                              .join('')}
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {(product.seller.sellerProfile as SellerProfile)
                          .businessName || 'Seller Information'}
                      </h3>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>
                            {
                              (product.seller.sellerProfile as SellerProfile)
                                .phone
                            }
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{product.seller.email}</span>
                        </div>
                      </div>

                      <Link
                        href={`/seller/${product.seller._id}`}
                        className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
                      >
                        <span>View Seller Profile</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    state: string;
    lga: string;
    price: number;
    images?: string[];
  };
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
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
            <ImageIcon className="w-12 h-12" strokeWidth={2} />
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
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-emerald-600">
            ₦{product.price.toLocaleString()}
          </span>
          <button
            onClick={() => router.push(`/products/${product._id}`)}
            className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FilterSidebar } from '@/components/FilterSidebar';
import { fetchSearchResults } from '@/store/slices/searchSlice';
import { AppDispatch, RootState } from '@/store/store';
import { SortDropdown } from '@/components/SortDropdown';
import ProductCard from '@/components/products/ProductCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { results, loading, error } = useSelector(
    (state: RootState) => state.search
  );
  const [sort, setSort] = useState(''); // Sorting state
  const [filters, setFilters] = useState({
    state: '',
    lga: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  // Fetch search results when params change
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(fetchSearchResults(params));
  }, [searchParams, dispatch]);

  return (
    <div className="flex">
      {/* Sidebar for Filters */}
      <FilterSidebar filters={filters} setFilters={setFilters} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{results.length} Results Found</h2>
          <SortDropdown sort={sort} setSort={setSort} />
        </div>

        {/* Display Results */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

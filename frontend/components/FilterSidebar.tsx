/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { location } from '@/app/data';
import { fetchCategories } from '@/store/slices/categorySlice';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select, { SingleValue } from 'react-select';

interface Filters {
  state: string;
  lga: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedState, setSelectedState] = useState<string | null>(
    filters.state || null
  );
  const [selectedLGA, setSelectedLGA] = useState<string | null>(
    filters.lga || null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    filters.category || null
  );

  // Get categories from Redux store
  const { categories, loading } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  // Dropdown options
  const stateOptions = location
    ? Object.keys(location).map((state) => ({ value: state, label: state }))
    : [];

  const lgaOptions =
    selectedState && location[selectedState]
      ? location[selectedState].map((lga) => ({ value: lga, label: lga }))
      : [];

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  // Handle filter changes
  const handleFilterChange = (name: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [name]: value ?? '' }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(filters as any);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <aside className="w-72 bg-white shadow-md rounded-lg p-5 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-2">
        Filters
      </h3>

      {/* State Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>
        <Select
          options={stateOptions}
          value={stateOptions.find((o) => o.value === selectedState) || null}
          onChange={(
            selected: SingleValue<{ value: string; label: string }>
          ) => {
            const value = selected?.value ?? null;
            setSelectedState(value);
            setSelectedLGA(null);
            handleFilterChange('state', value);
            handleFilterChange('lga', null);
          }}
          placeholder="Select State"
          isClearable
        />
      </div>

      {/* LGA Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LGA
        </label>
        <Select
          options={lgaOptions}
          value={lgaOptions.find((o) => o.value === selectedLGA) || null}
          onChange={(
            selected: SingleValue<{ value: string; label: string }>
          ) => {
            const value = selected?.value ?? null;
            setSelectedLGA(value);
            handleFilterChange('lga', value);
          }}
          placeholder="Select LGA"
          isClearable
          isDisabled={!selectedState}
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <Select
          options={categoryOptions}
          value={
            categoryOptions.find((o) => o.value === selectedCategory) || null
          }
          onChange={(
            selected: SingleValue<{ value: string; label: string }>
          ) => {
            const value = selected?.value ?? null;
            setSelectedCategory(value);
            handleFilterChange('category', value);
          }}
          placeholder={loading ? 'Loading categories...' : 'Select Category'}
          isClearable
          isDisabled={loading}
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex space-x-3">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            placeholder="Min"
            className="w-1/2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            placeholder="Max"
            className="w-1/2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition duration-200"
      >
        Apply Filters
      </button>
    </aside>
  );
}

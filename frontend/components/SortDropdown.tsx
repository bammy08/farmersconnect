'use client';

import { useRouter } from 'next/navigation';

interface SortDropdownProps {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}

export function SortDropdown({ sort, setSort }: SortDropdownProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);

    const params = new URLSearchParams(window.location.search);
    params.set('sort', newSort);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <select
      value={sort}
      onChange={handleSortChange}
      className="border p-2 rounded"
    >
      <option value="">Sort By</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="name_asc">Name: A to Z</option>
      <option value="name_desc">Name: Z to A</option>
    </select>
  );
}

'use client';

import { useState } from 'react';

export default function FilterDropdown({
  setFilter,
}: {
  setFilter: (value: string) => void;
}) {
  const [selected, setSelected] = useState('all');

  const handleFilterChange = (value: string) => {
    setSelected(value);
    setFilter(value);
  };

  return (
    <div className="mb-4">
      <select
        className="p-2 border rounded"
        value={selected}
        onChange={(e) => handleFilterChange(e.target.value)}
      >
        <option value="all">All Users</option>
        <option value="buyers">Buyers</option>
        <option value="sellers">Sellers</option>
      </select>
    </div>
  );
}

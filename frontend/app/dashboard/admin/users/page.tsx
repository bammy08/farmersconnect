'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import FilterDropdown from '@/components/admin/FilterDropdown';
import UsersTable from '@/components/admin/UsersTable';

export default function AdminUsers() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <FilterDropdown setFilter={setFilter} />
      <UsersTable filter={filter} />
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login'); // Redirect to login if not admin
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    ); // Full-page loader
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </div>
  );
}

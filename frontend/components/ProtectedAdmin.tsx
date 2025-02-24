'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react'; // ShadCN spinner

export default function ProtectedAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/'); // Redirect if not admin
    } else {
      setLoading(false); // Stop loading once authenticated
    }
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  return <>{children}</>;
}

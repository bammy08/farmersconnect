import { useState, useEffect } from 'react';
import { fetchUsers } from '@/services/admin/adminService';
import { User } from '@/types/user';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data: User[] = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { users, loading, error, setUsers, refetch: fetchData };
};

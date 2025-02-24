'use client';

import { useFetchUsers } from '@/hooks/useFetchUsers';
import {
  approveSeller,
  deleteUser,
  rejectSeller,
} from '@/services/admin/adminService';
import { useState } from 'react';
import { User } from '@/types/user';

export default function UsersTable({ filter }: { filter: string }) {
  const { users, loading, error, setUsers, refetch } = useFetchUsers();
  const [processing, setProcessing] = useState(false);

  const handleApprove = async (userId: string) => {
    setProcessing(true);

    try {
      // ✅ Optimistically update UI immediately
      setUsers((prev: User[]) =>
        prev.map((user) =>
          user._id === userId && user.sellerProfile
            ? {
                ...user,
                sellerProfile: { ...user.sellerProfile, isApproved: true }, // ✅ Update inside sellerProfile
              }
            : user
        )
      );

      // ✅ Call API to approve seller
      await approveSeller(userId);

      // ✅ Fetch fresh data from the backend to ensure consistency
      refetch();
    } catch (error) {
      console.error('Approval failed:', error);
    }

    setProcessing(false);
  };

  const handleReject = async (id: string) => {
    setProcessing(true);
    await rejectSeller(id);
    setUsers((prev: User[]) => prev.filter((user) => user._id !== id));
    setProcessing(false);
  };

  const handleDelete = async (id: string) => {
    setProcessing(true);
    await deleteUser(id);
    setUsers((prev: User[]) => prev.filter((user) => user._id !== id));
    setProcessing(false);
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  const filteredUsers =
    filter === 'all'
      ? users
      : users.filter((user) =>
          filter === 'buyers' ? user.role === 'user' : user.role === 'seller'
        );

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <tr key={user._id} className="text-center">
            <td className="border p-2">{user.name}</td>
            <td className="border p-2">{user.email}</td>
            <td className="border p-2">{user.role}</td>
            <td className="border p-2 space-x-2">
              {user.role === 'seller' && !user.sellerProfile?.isApproved && (
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleApprove(user._id)}
                  disabled={processing}
                >
                  Approve
                </button>
              )}
              {user.role === 'seller' && !user.sellerProfile?.isApproved && (
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleReject(user._id)}
                  disabled={processing}
                >
                  Reject
                </button>
              )}
              <button
                className="px-2 py-1 bg-gray-500 text-white rounded"
                onClick={() => handleDelete(user._id)}
                disabled={processing}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

'use client';

import { resetPasswordAction } from '@/store/slices/resetSlice';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store/store';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { successMessage, error, loading } = useSelector(
    (state: RootState) => state.reset
  );

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setTimeout(() => {
        router.push('/login'); // Redirect after success
      }, 2000);
    }
    if (error) {
      toast.error(error);
    }
  }, [successMessage, error, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }
    dispatch(resetPasswordAction({ token, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Reset Password
        </h2>
        <p className="text-gray-500 text-center mb-4">
          Enter a new password for your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

'use client';

import { forgotPasswordAction } from '@/store/slices/resetSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { successMessage, error, loading } = useSelector(
    (state: RootState) => state.reset
  );

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPasswordAction(email));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white rounded-lg py-3 text-base font-medium transition-all"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

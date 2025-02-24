/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Get token from URL query params

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setMessage('Invalid verification link');
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify/${token}`
        );

        setMessage(response.data.message);
        setLoading(false);

        // ✅ Dispatch login action to store token and role
        if (response.data.token && response.data.user) {
          dispatch(
            login({
              token: response.data.token,
              role: response.data.user.role,
            })
          );
        }

        // ✅ Redirect seller to onboarding after 2 seconds
        setTimeout(() => {
          router.push('/onboarding');
        }, 2000);
      } catch (error) {
        setMessage('Invalid or expired token.');
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Email Verification</h2>
        {loading ? <p>Verifying your email...</p> : <p>{message}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;

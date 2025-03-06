'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { fetchNotifications } from '@/store/slices/notificationSlice';
import type { AppDispatch } from '@/store/store'; // ✅ Import AppDispatch type

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Use AppDispatch
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get token & userId from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken) setToken(storedToken);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId && token) {
      socket.emit('join', userId);

      const handleNotification = () => {
        dispatch(fetchNotifications(token)); // ✅ Now dispatch works correctly
      };

      socket.on('receiveNotification', handleNotification);

      return () => {
        socket.off('receiveNotification', handleNotification);
      };
    }
  }, [userId, token, dispatch]);

  return <>{children}</>;
}

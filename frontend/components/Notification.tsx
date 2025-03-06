/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchNotifications,
  markAsRead,
} from '@/store/slices/notificationSlice';
import { Bell } from 'lucide-react'; // Notification icon
import { usePathname } from 'next/navigation';

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
); // Your backend Socket.io server

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      dispatch(fetchNotifications(storedToken));

      // Join the socket room for the logged-in user
      socket.emit('joinRoom', storedToken);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!token) return;

    // Listen for real-time notifications
    socket.on('newNotification', (newNotification) => {
      dispatch(fetchNotifications(token)); // Fetch updated notifications
    });

    return () => {
      socket.off('newNotification');
    };
  }, [dispatch, token]);

  const handleMarkAsRead = (id: string) => {
    if (token) {
      dispatch(markAsRead({ notificationId: id, token }));
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.seen).length;

  return (
    <div className="relative">
      {/* Bell Icon with Unread Count */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative"
      >
        <Bell size={24} className="text-gray-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-500">No new notifications</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`p-2 ${
                    notif.seen ? 'text-gray-500' : 'text-black font-semibold'
                  }`}
                >
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="block w-full text-left"
                  >
                    {notif.message}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;

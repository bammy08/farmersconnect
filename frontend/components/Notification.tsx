/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { AppDispatch, RootState } from '@/store/store';
import {
  addNotification,
  fetchNotifications,
  markAsRead,
} from '@/store/slices/notificationSlice';
import { Bell, Loader2, CheckCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
);

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notification
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      dispatch(fetchNotifications(storedToken));
      socket.emit('joinRoom', storedToken);
    }
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) return;

    socket.on('newNotification', (newNotification) => {
      dispatch(addNotification(newNotification)); // ✅ GOOD: Adds notification in real-time
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
      <button
        ref={buttonRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-100 z-50"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 flex flex-col items-center justify-center gap-2 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p>Loading notifications</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 flex flex-col items-center justify-center gap-2 text-gray-500">
                <CheckCircle className="w-6 h-6" />
                <p>All caught up!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <li
                    key={notif._id}
                    className={cn(
                      'px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer',
                      notif.seen ? 'bg-white' : 'bg-blue-50/50' // ✅ Change color when 'seen' is true
                    )}
                    onClick={() => handleMarkAsRead(notif._id)}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.seen && (
                        <span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                      )}
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <span className="text-xs text-gray-400 ml-auto shrink-0">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

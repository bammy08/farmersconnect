/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { addMessage } from '@/store/slices/chatSlice';

interface ChatContextType {
  socket: Socket | null;
  sendMessage: (messageData: { recipientId: string; message: string }) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Get userId from localStorage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // ✅ Initialize socket when `userId` is available
  useEffect(() => {
    if (userId) {
      const newSocket = io(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
        {
          withCredentials: true,
        }
      );

      newSocket.emit('join', userId);

      // ✅ Handle receiving messages (real-time update)
      const handleNewMessage = (messageData: any) => {
        dispatch(addMessage(messageData)); // Update Redux store
      };

      newSocket.on('receiveMessage', handleNewMessage);

      setSocket(newSocket);

      return () => {
        newSocket.off('receiveMessage', handleNewMessage);
        newSocket.disconnect(); // ✅ Cleanup
      };
    }
  }, [userId, dispatch]);

  // ✅ Function to send a message
  const sendMessage = (messageData: {
    recipientId: string;
    message: string;
  }) => {
    if (socket) {
      socket.emit('sendMessage', messageData);
    }
  };

  return (
    <ChatContext.Provider value={{ socket, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

// ✅ Custom Hook to use Chat Context
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}

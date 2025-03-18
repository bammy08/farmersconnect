/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchChats, sendMessage, addMessage } from '@/store/slices/chatSlice';
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

const ChatPage = () => {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get('seller');
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Get user and token from Redux
  const { isAuthenticated, user, token } = useSelector(
    (state: RootState) => state.auth
  );
  const messages = useSelector((state: RootState) => state.chat.chats);

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || !sellerId || !token) return;
    console.log('Token being sent:', token);

    dispatch(fetchChats({ userId: user.id, token })); // ✅ Fetch chat history

    socket.emit('joinChat', { userId: user.id, sellerId });

    socket.on('newMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
    });

    return () => {
      socket.off('newMessage');
    };
  }, [dispatch, user, sellerId, token]);

  const handleSendMessage = () => {
    if (!message.trim() || !sellerId || !token) return;

    // ✅ Send message with correct field names
    dispatch(sendMessage({ receiver: sellerId, content: message, token }));
    setMessage('');
  };

  if (!token) {
    return <p className="text-center text-red-500">Please log in to chat.</p>;
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Chat with Seller</h2>
      <div className="h-80 overflow-y-auto border rounded p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded my-1 ${
              msg.sender === user?.id ? 'bg-green-100' : 'bg-gray-200'
            }`}
          >
            <p>{msg.content}</p> {/* ✅ Fixed message field */}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="border p-2 flex-1 rounded-l"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;

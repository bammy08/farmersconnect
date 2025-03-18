'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, sendMessage, addMessage } from '@/store/slices/chatSlice';
import { io } from 'socket.io-client';
import type { AppDispatch, RootState } from '@/store/store';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, loading } = useSelector((state: RootState) => state.chat);
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // ✅ Fetch chat history on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchChats(token));
      socket.emit('join', userId);
    }
  }, [dispatch, token, userId]);

  // ✅ Listen for real-time messages
  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      dispatch(addMessage(newMessage)); // Add received message to state
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [dispatch]);

  // ✅ Send message function
  const handleSendMessage = async () => {
    if (!message || !recipientId) return;

    const chatData = { recipientId, message, token: token || '' };
    await dispatch(sendMessage(chatData));

    // Emit real-time event
    socket.emit('sendMessage', {
      senderId: userId,
      recipientId,
      message,
      timestamp: new Date().toISOString(),
    });

    setMessage(''); // Clear input
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>

      {/* ✅ Message list */}
      <div className="h-60 overflow-y-auto border p-2 mb-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          chats.map((chat, index) => (
            <div
              key={index}
              className={`p-2 mb-1 rounded ${
                chat.senderId === userId
                  ? 'bg-blue-200 text-right'
                  : 'bg-gray-200'
              }`}
            >
              <p>{chat.message}</p>
              <span className="text-xs text-gray-600">
                {new Date(chat.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ✅ Input field */}
      <input
        type="text"
        placeholder="Recipient ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleSendMessage}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default Chat;

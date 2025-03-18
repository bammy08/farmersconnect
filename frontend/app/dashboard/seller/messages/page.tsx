'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchChats, sendMessage, addMessage } from '@/store/slices/chatSlice';
import { io } from 'socket.io-client';
import { format } from 'date-fns';

// Initialize Socket.io
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

const Messages = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Get user info from Redux
  const { user, token } = useSelector((state: RootState) => state.auth);
  const messages = useSelector((state: RootState) => state.chat.chats);

  const [reply, setReply] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    // ✅ Fetch messages when the component loads
    dispatch(fetchChats({ userId: user.id, token }));

    // ✅ Join chat socket room
    socket.emit('joinSellerChat', { sellerId: user.id });

    // ✅ Listen for new messages in real time
    socket.on('newMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
    });

    return () => {
      socket.off('newMessage');
    };
  }, [dispatch, user, token]);

  // ✅ Send message function
  const handleSendReply = () => {
    if (!reply.trim() || !selectedChat || !token) return;

    dispatch(sendMessage({ receiver: selectedChat, content: reply, token }));
    setReply('');
  };

  if (!token) {
    return (
      <p className="text-center text-red-500">
        Please log in to view messages.
      </p>
    );
  }

  if (!user) return <p>Loading...</p>;

  // ✅ Group messages by sender (Fix sender as an object)
  const groupedMessages = messages.reduce((acc, msg) => {
    const sender =
      typeof msg.sender === 'object'
        ? msg.sender
        : { _id: msg.sender, name: 'Unknown User' };

    acc[sender._id] = acc[sender._id] || { name: sender.name, messages: [] };
    acc[sender._id].messages.push(msg);

    return acc;
  }, {} as Record<string, { name: string; messages: typeof messages }>);

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Messages</h2>

      {/* ✅ List of conversations */}
      <div className="h-40 overflow-y-auto border rounded p-2 mb-4">
        {Object.keys(groupedMessages).length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          Object.entries(groupedMessages).map(
            ([senderId, { name, messages }]) => (
              <div
                key={senderId}
                className={`p-2 rounded my-1 cursor-pointer ${
                  selectedChat === senderId ? 'bg-blue-100' : 'bg-gray-200'
                }`}
                onClick={() => setSelectedChat(senderId)}
              >
                <p>
                  <strong>{senderId === user.id ? 'You' : name}</strong> (
                  {messages.length} messages)
                </p>
              </div>
            )
          )
        )}
      </div>

      {/* ✅ Chat window for selected user */}
      {selectedChat && (
        <div className="h-40 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
          {groupedMessages[selectedChat]?.messages.map((msg, index) => {
            const sender =
              typeof msg.sender === 'object'
                ? msg.sender
                : { _id: msg.sender, name: 'Unknown User' }; // Ensure sender is an object

            return (
              <div
                key={index}
                className={`p-2 rounded my-1 ${
                  sender._id === user.id
                    ? 'bg-green-100 text-right'
                    : 'bg-gray-200 text-left'
                }`}
              >
                <p>
                  <strong>{sender.name}</strong>: {msg.content}
                </p>
                <p className="text-xs text-gray-500">
                  {msg.timestamp
                    ? format(new Date(msg.timestamp), 'dd/MM/yyyy HH:mm')
                    : ''}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Reply box */}
      {selectedChat && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Reply to {groupedMessages[selectedChat]?.name}
          </h3>
          <div className="flex">
            <input
              type="text"
              className="border p-2 flex-1 rounded-l"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <button
              onClick={handleSendReply}
              className="bg-green-500 text-white px-4 py-2 rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

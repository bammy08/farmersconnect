import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true },
    seen: { type: Boolean, default: false }, // Mark when the recipient reads the message
  },
  { timestamps: true }
);

export default mongoose.model('Chat', ChatSchema);

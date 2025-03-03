import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['message', 'comment'], required: true },
    message: { type: String, required: true }, // Notification text
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);

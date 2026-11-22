import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user?: mongoose.Types.ObjectId;
  recipientRole?: 'CUSTOMER' | 'ADMIN' | 'B2B_CUSTOMER';
  title: string;
  message: string;
  type: 'ORDER_UPDATE' | 'STOCK_ALERT' | 'B2B_ENQUIRY' | 'GENERAL';
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    recipientRole: { type: String, enum: ['CUSTOMER', 'ADMIN', 'B2B_CUSTOMER'] },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['ORDER_UPDATE', 'STOCK_ALERT', 'B2B_ENQUIRY', 'GENERAL'], default: 'GENERAL' },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

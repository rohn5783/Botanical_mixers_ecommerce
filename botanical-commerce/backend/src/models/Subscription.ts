import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variantSku: string;
  frequencyDays: number; // 14, 30, 45, 60
  quantity: number;
  discountPercentage: number;
  nextDeliveryDate: Date;
  shippingAddress: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String, required: true },
    frequencyDays: { type: Number, required: true, enum: [14, 30, 45, 60], default: 30 },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    discountPercentage: { type: Number, default: 10 },
    nextDeliveryDate: { type: Date, required: true },
    shippingAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    status: { type: String, enum: ['ACTIVE', 'PAUSED', 'CANCELLED'], default: 'ACTIVE', index: true },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

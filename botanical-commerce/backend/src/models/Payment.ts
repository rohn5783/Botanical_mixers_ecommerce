import mongoose, { Document, Schema } from 'mongoose';
import { PaymentStatus } from '../types/index.js';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amountInPaise: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  failureReason?: string;
  rawWebhookData?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: { type: String },
    amountInPaise: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentMethod: { type: String },
    failureReason: { type: String },
    rawWebhookData: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

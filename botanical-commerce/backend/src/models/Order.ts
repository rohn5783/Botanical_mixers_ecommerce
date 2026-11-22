import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus, PaymentStatus } from '../types/index.js';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  variantSku: string;
  variantName: string;
  volumeMl: number;
  unitPriceInPaise: number;
  quantity: number;
  totalPriceInPaise: number;
  image: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: IShippingAddress;
  items: IOrderItem[];
  subtotalInPaise: number;
  taxInPaise: number;
  shippingFeeInPaise: number;
  discountInPaise: number;
  couponCode?: string;
  totalAmountInPaise: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  customerNotes?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  variantSku: { type: String, required: true },
  variantName: { type: String, required: true },
  volumeMl: { type: Number, required: true },
  unitPriceInPaise: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPriceInPaise: { type: Number, required: true },
  image: { type: String, default: '' },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  streetAddress: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    items: [OrderItemSchema],
    subtotalInPaise: { type: Number, required: true, min: 0 },
    taxInPaise: { type: Number, required: true, default: 0 },
    shippingFeeInPaise: { type: Number, required: true, default: 0 },
    discountInPaise: { type: Number, default: 0 },
    couponCode: { type: String },
    totalAmountInPaise: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentMethod: { type: String, default: 'RAZORPAY' },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    trackingNumber: { type: String },
    trackingCarrier: { type: String, default: 'BlueDart / Delhivery' },
    customerNotes: { type: String },
    cancelReason: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

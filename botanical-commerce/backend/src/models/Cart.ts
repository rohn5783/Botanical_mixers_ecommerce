import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  variantSku: string;
  variantName: string;
  volumeMl: number;
  quantity: number;
  priceInPaise: number;
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  guestToken?: string;
  items: ICartItem[];
  couponCode?: string;
  discountInPaise: number;
  subtotalInPaise: number;
  totalAmountInPaise: number;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantSku: { type: String, required: true },
  variantName: { type: String, required: true },
  volumeMl: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  priceInPaise: { type: Number, required: true, min: 0 },
});

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestToken: { type: String, index: true },
    items: [CartItemSchema],
    couponCode: { type: String, uppercase: true, trim: true },
    discountInPaise: { type: Number, default: 0 },
    subtotalInPaise: { type: Number, default: 0 },
    totalAmountInPaise: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);

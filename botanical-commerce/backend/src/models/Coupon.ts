import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT_PAISE';
  discountValue: number;
  minOrderValueInPaise: number;
  maxDiscountInPaise?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FLAT_PAISE'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValueInPaise: { type: Number, default: 0 },
    maxDiscountInPaise: { type: Number },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 500 },
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);

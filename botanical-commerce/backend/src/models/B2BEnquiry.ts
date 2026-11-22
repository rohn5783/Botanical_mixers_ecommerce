import mongoose, { Document, Schema } from 'mongoose';
import { B2BStatus, BusinessType } from '../types/index.js';

export interface IB2BEnquiry extends Document {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: BusinessType;
  gstin?: string;
  city: string;
  state: string;
  estimatedMonthlyVolumeLiters: number;
  interestedProducts: mongoose.Types.ObjectId[];
  message: string;
  status: B2BStatus;
  quotationRef?: mongoose.Types.ObjectId;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const B2BEnquirySchema = new Schema<IB2BEnquiry>(
  {
    businessName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    businessType: { type: String, enum: Object.values(BusinessType), default: BusinessType.CAFE, index: true },
    gstin: { type: String, uppercase: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    estimatedMonthlyVolumeLiters: { type: Number, required: true, default: 20 },
    interestedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    message: { type: String, required: true },
    status: { type: String, enum: Object.values(B2BStatus), default: B2BStatus.NEW, index: true },
    quotationRef: { type: Schema.Types.ObjectId, ref: 'Quotation' },
    adminNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const B2BEnquiry = mongoose.model<IB2BEnquiry>('B2BEnquiry', B2BEnquirySchema);

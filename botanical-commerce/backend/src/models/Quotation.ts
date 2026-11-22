import mongoose, { Document, Schema } from 'mongoose';

export interface IQuotationItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  variantSku: string;
  variantName: string;
  unitPriceInPaise: number;
  quantity: number;
  lineTotalInPaise: number;
}

export interface IQuotation extends Document {
  quotationNumber: string;
  enquiry: mongoose.Types.ObjectId;
  businessName: string;
  contactEmail: string;
  items: IQuotationItem[];
  subtotalInPaise: number;
  gstInPaise: number;
  freightInPaise: number;
  grandTotalInPaise: number;
  validUntil: Date;
  terms: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}

const QuotationItemSchema = new Schema<IQuotationItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  variantSku: { type: String, required: true },
  variantName: { type: String, required: true },
  unitPriceInPaise: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  lineTotalInPaise: { type: Number, required: true },
});

const QuotationSchema = new Schema<IQuotation>(
  {
    quotationNumber: { type: String, required: true, unique: true, index: true },
    enquiry: { type: Schema.Types.ObjectId, ref: 'B2BEnquiry', required: true, index: true },
    businessName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    items: [QuotationItemSchema],
    subtotalInPaise: { type: Number, required: true },
    gstInPaise: { type: Number, required: true },
    freightInPaise: { type: Number, default: 0 },
    grandTotalInPaise: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    terms: {
      type: String,
      default: 'Payment terms: 50% advance upon order placement, balance prior to dispatch. Delivery: 3-5 business days across Pan-India metro locations.',
    },
    status: { type: String, enum: ['DRAFT', 'SENT', 'ACCEPTED', 'EXPIRED'], default: 'SENT', index: true },
  },
  {
    timestamps: true,
  }
);

export const Quotation = mongoose.model<IQuotation>('Quotation', QuotationSchema);

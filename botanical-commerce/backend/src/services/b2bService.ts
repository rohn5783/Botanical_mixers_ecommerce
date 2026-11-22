import { B2BEnquiry, IB2BEnquiry } from '../models/B2BEnquiry.js';
import { Quotation } from '../models/Quotation.js';
import { generateQuotationNumber } from '../utils/orderNumber.js';
import { B2BStatus } from '../types/index.js';

export class B2BService {
  static async createEnquiry(data: any): Promise<IB2BEnquiry> {
    return B2BEnquiry.create(data);
  }

  static async getEnquiries(status?: string) {
    const query: any = {};
    if (status) {
      query.status = status;
    }
    return B2BEnquiry.find(query)
      .populate('interestedProducts', 'name slug variants')
      .populate('quotationRef')
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getEnquiryById(id: string) {
    const enquiry = await B2BEnquiry.findById(id)
      .populate('interestedProducts')
      .populate('quotationRef')
      .lean();
    if (!enquiry) {
      throw new Error('B2B enquiry not found.');
    }
    return enquiry;
  }

  static async createQuotationForEnquiry(data: {
    enquiryId: string;
    items: Array<{
      product: string;
      productName: string;
      variantSku: string;
      variantName: string;
      unitPriceInPaise: number;
      quantity: number;
    }>;
    freightInPaise?: number;
    terms?: string;
  }) {
    const enquiry = await B2BEnquiry.findById(data.enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found.');
    }

    let subtotalInPaise = 0;
    const formattedItems = data.items.map((item) => {
      const lineTotalInPaise = item.unitPriceInPaise * item.quantity;
      subtotalInPaise += lineTotalInPaise;
      return {
        ...item,
        lineTotalInPaise,
      };
    });

    const gstInPaise = Math.round((subtotalInPaise * 12) / 100);
    const freightInPaise = data.freightInPaise || 0;
    const grandTotalInPaise = subtotalInPaise + gstInPaise + freightInPaise;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // 30 days validity

    const quotation = await Quotation.create({
      quotationNumber: generateQuotationNumber(),
      enquiry: enquiry._id,
      businessName: enquiry.businessName,
      contactEmail: enquiry.email,
      items: formattedItems,
      subtotalInPaise,
      gstInPaise,
      freightInPaise,
      grandTotalInPaise,
      validUntil,
      terms: data.terms,
      status: 'SENT',
    });

    enquiry.status = B2BStatus.QUOTATION_SENT;
    enquiry.quotationRef = quotation._id as any;
    await enquiry.save();

    return quotation;
  }
}

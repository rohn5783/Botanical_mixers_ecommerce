import { Request, Response, NextFunction } from 'express';
import { B2BService } from '../services/b2bService.js';
import { b2bEnquirySchema } from '../validators/index.js';

export class B2BController {
  static async submitEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = b2bEnquirySchema.parse(req.body);
      const enquiry = await B2BService.createEnquiry(validated);
      res.status(201).json({
        success: true,
        message: 'Your B2B enquiry has been received. Our trade team will review and connect within 24 business hours.',
        data: enquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEnquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;
      const enquiries = await B2BService.getEnquiries(status as string);
      res.status(200).json({ success: true, data: enquiries });
    } catch (error) {
      next(error);
    }
  }

  static async getEnquiryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const enquiry = await B2BService.getEnquiryById(id);
      res.status(200).json({ success: true, data: enquiry });
    } catch (error) {
      next(error);
    }
  }

  static async createQuotation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quotation = await B2BService.createQuotationForEnquiry(req.body);
      res.status(201).json({
        success: true,
        message: 'Formal commercial quotation generated successfully.',
        data: quotation,
      });
    } catch (error) {
      next(error);
    }
  }
}

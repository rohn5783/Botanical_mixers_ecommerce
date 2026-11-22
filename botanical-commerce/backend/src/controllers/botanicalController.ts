import { Request, Response, NextFunction } from 'express';
import { BotanicalService } from '../services/botanicalService.js';

export class BotanicalController {
  static async getAllBotanicals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const botanicals = await BotanicalService.getAllBotanicals();
      res.status(200).json({ success: true, data: botanicals });
    } catch (error) {
      next(error);
    }
  }

  static async getBotanicalBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;
      const result = await BotanicalService.getBotanicalBySlug(slug);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

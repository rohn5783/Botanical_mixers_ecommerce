import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService.js';
import { productCreateSchema } from '../validators/index.js';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        category,
        botanical,
        minPrice,
        maxPrice,
        inStock,
        search,
        sort,
        page,
        limit,
      } = req.query;

      const result = await ProductService.getProducts({
        categorySlug: category as string,
        botanicalSlug: botanical as string,
        minPricePaise: minPrice ? parseInt(minPrice as string, 10) : undefined,
        maxPricePaise: maxPrice ? parseInt(maxPrice as string, 10) : undefined,
        inStockOnly: inStock === 'true',
        search: search as string,
        sort: sort as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 12,
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;
      const result = await ProductService.getProductBySlug(slug);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = productCreateSchema.parse(req.body);
      const product = await ProductService.createProduct(validated);
      res.status(201).json({ success: true, message: 'Product created successfully.', data: product });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const product = await ProductService.updateProduct(id, req.body);
      res.status(200).json({ success: true, message: 'Product updated successfully.', data: product });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const result = await ProductService.deleteProduct(id);
      res.status(200).json({ success: true, message: 'Product deleted successfully.', data: result });
    } catch (error) {
      next(error);
    }
  }
}

import { Product, IProduct } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { BotanicalIngredient } from '../models/BotanicalIngredient.js';
import { Inventory } from '../models/Inventory.js';
import mongoose from 'mongoose';

export interface IProductQueryFilters {
  categorySlug?: string;
  botanicalSlug?: string;
  minPricePaise?: number;
  maxPricePaise?: number;
  inStockOnly?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'featured';
  page?: number;
  limit?: number;
}

export class ProductService {
  static async getProducts(filters: IProductQueryFilters) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(50, Math.max(1, filters.limit || 12));
    const skip = (page - 1) * limit;

    const query: any = { isPublished: true };

    if (filters.categorySlug) {
      const cat = await Category.findOne({ slug: filters.categorySlug });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (filters.botanicalSlug) {
      const bot = await BotanicalIngredient.findOne({ slug: filters.botanicalSlug });
      if (bot) {
        query.botanicalIngredient = bot._id;
      }
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { shortDescription: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    if (filters.minPricePaise || filters.maxPricePaise) {
      query['variants.priceInPaise'] = {};
      if (filters.minPricePaise !== undefined) {
        query['variants.priceInPaise'].$gte = filters.minPricePaise;
      }
      if (filters.maxPricePaise !== undefined) {
        query['variants.priceInPaise'].$lte = filters.maxPricePaise;
      }
    }

    let sortOption: any = { isFeatured: -1, createdAt: -1 };
    if (filters.sort === 'price_asc') {
      sortOption = { 'variants.0.priceInPaise': 1 };
    } else if (filters.sort === 'price_desc') {
      sortOption = { 'variants.0.priceInPaise': -1 };
    } else if (filters.sort === 'rating') {
      sortOption = { ratingAverage: -1 };
    } else if (filters.sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('botanicalIngredient', 'name slug originRegion')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  static async getProductBySlug(slug: string) {
    const product = await Product.findOne({ slug, isPublished: true })
      .populate('category')
      .populate('botanicalIngredient')
      .lean();

    if (!product) {
      throw new Error(`Product '${slug}' not found.`);
    }

    // Related products in same category or botanical
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category }, { botanicalIngredient: product.botanicalIngredient }],
      isPublished: true,
    })
      .limit(4)
      .lean();

    return { product, relatedProducts };
  }

  static async createProduct(data: any) {
    const product = await Product.create(data);

    // Initialize inventory for all variants
    for (const v of product.variants) {
      await Inventory.create({
        product: product._id,
        variantSku: v.sku,
        availableStock: v.stock || 100,
        reservedStock: 0,
        history: [{ changeAmount: v.stock || 100, reason: 'Initial inventory creation' }],
      });
    }

    return product;
  }

  static async updateProduct(id: string, data: any) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) {
      throw new Error('Product not found.');
    }
    return product;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found.');
    }
    await Inventory.deleteMany({ product: id });
    return { success: true };
  }
}

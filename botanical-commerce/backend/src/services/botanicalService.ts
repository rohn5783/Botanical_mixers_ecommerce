import { BotanicalIngredient } from '../models/BotanicalIngredient.js';
import { Product } from '../models/Product.js';
import { Recipe } from '../models/Recipe.js';

export class BotanicalService {
  static async getAllBotanicals() {
    return BotanicalIngredient.find({ isActive: true }).sort({ name: 1 }).lean();
  }

  static async getBotanicalBySlug(slug: string) {
    const botanical = await BotanicalIngredient.findOne({ slug, isActive: true }).lean();
    if (!botanical) {
      throw new Error(`Botanical ingredient '${slug}' not found.`);
    }

    const [products, recipes] = await Promise.all([
      Product.find({ botanicalIngredient: botanical._id, isPublished: true }).lean(),
      Recipe.find({}).populate('requiredBotanicalProducts').lean(),
    ]);

    // Filter recipes that use products linked to this botanical
    const matchingRecipes = recipes.filter((r) =>
      r.requiredBotanicalProducts.some((p: any) =>
        p.botanicalIngredient?.toString() === botanical._id.toString() ||
        products.some((bp) => bp._id.toString() === p._id?.toString())
      )
    );

    return {
      botanical,
      products,
      recipes: matchingRecipes.length > 0 ? matchingRecipes : recipes.slice(0, 3),
    };
  }
}

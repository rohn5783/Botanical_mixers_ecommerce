import { Recipe } from '../models/Recipe.js';
import { Product } from '../models/Product.js';

export class RecipeService {
  static async getAllRecipes(category?: string, difficulty?: string) {
    const query: any = {};
    if (category) {
      query.category = category.toUpperCase();
    }
    if (difficulty) {
      query.difficulty = difficulty.toUpperCase();
    }

    return Recipe.find(query)
      .populate('requiredBotanicalProducts', 'name slug images variants')
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
  }

  static async getRecipeBySlug(slug: string) {
    const recipe = await Recipe.findOne({ slug })
      .populate('requiredBotanicalProducts')
      .lean();

    if (!recipe) {
      throw new Error(`Recipe '${slug}' not found.`);
    }

    const relatedRecipes = await Recipe.find({
      _id: { $ne: recipe._id },
      category: recipe.category,
    })
      .limit(3)
      .populate('requiredBotanicalProducts', 'name slug images variants')
      .lean();

    return { recipe, relatedRecipes };
  }

  static async createRecipe(data: any) {
    return Recipe.create(data);
  }
}

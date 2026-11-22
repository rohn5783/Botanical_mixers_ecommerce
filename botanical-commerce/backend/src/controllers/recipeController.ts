import { Request, Response, NextFunction } from 'express';
import { RecipeService } from '../services/recipeService.js';

export class RecipeController {
  static async getAllRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, difficulty } = req.query;
      const recipes = await RecipeService.getAllRecipes(category as string, difficulty as string);
      res.status(200).json({ success: true, data: recipes });
    } catch (error) {
      next(error);
    }
  }

  static async getRecipeBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;
      const result = await RecipeService.getRecipeBySlug(slug);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recipe = await RecipeService.createRecipe(req.body);
      res.status(201).json({ success: true, message: 'Recipe created successfully.', data: recipe });
    } catch (error) {
      next(error);
    }
  }
}

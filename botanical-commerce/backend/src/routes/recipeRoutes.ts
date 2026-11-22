import { Router } from 'express';
import { RecipeController } from '../controllers/recipeController.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { UserRole } from '../types/index.js';

const router = Router();

router.get('/', RecipeController.getAllRecipes);
router.get('/:slug', RecipeController.getRecipeBySlug);
router.post('/', authenticate, authorizeRoles(UserRole.ADMIN), RecipeController.createRecipe);

export default router;

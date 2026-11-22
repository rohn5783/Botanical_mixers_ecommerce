import mongoose, { Document, Schema } from 'mongoose';
import { RecipeCategory, RecipeDifficulty } from '../types/index.js';

export interface IRecipeIngredient {
  name: string;
  amount: string;
  unit: string;
  isBotanicalConcentrate: boolean;
  productRef?: mongoose.Types.ObjectId;
}

export interface IRecipeInstruction {
  stepNumber: number;
  title: string;
  text: string;
  proTip?: string;
}

export interface IRecipe extends Document {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  heroImage: string;
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
  prepTimeMinutes: number;
  servingYield: number;
  requiredBotanicalProducts: mongoose.Types.ObjectId[];
  ingredients: IRecipeIngredient[];
  instructions: IRecipeInstruction[];
  glassware: string;
  garnish: string;
  caloriesKcal: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    heroImage: { type: String, required: true },
    category: { type: String, enum: Object.values(RecipeCategory), default: RecipeCategory.MOCKTAIL, index: true },
    difficulty: { type: String, enum: Object.values(RecipeDifficulty), default: RecipeDifficulty.EASY },
    prepTimeMinutes: { type: Number, required: true, default: 5 },
    servingYield: { type: Number, required: true, default: 1 },
    requiredBotanicalProducts: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    ingredients: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
        unit: { type: String, required: true },
        isBotanicalConcentrate: { type: Boolean, default: false },
        productRef: { type: Schema.Types.ObjectId, ref: 'Product' },
      },
    ],
    instructions: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        text: { type: String, required: true },
        proTip: { type: String },
      },
    ],
    glassware: { type: String, default: 'Highball Glass or Stemmed Copa' },
    garnish: { type: String, default: 'Fresh mint sprig & dehydrated lime wheel' },
    caloriesKcal: { type: Number, default: 65 },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);

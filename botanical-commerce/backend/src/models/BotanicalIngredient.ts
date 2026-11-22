import mongoose, { Document, Schema } from 'mongoose';

export interface IBotanicalIngredient extends Document {
  name: string;
  scientificName: string;
  commonNames: string[];
  slug: string;
  originRegion: string;
  harvestingMethod: string;
  tasteNotes: string[];
  sensoryAroma: string;
  traditionalUses: string[];
  image: string;
  bannerImage: string;
  healthDisclaimer: string;
  heroQuote: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BotanicalIngredientSchema = new Schema<IBotanicalIngredient>(
  {
    name: { type: String, required: true, trim: true },
    scientificName: { type: String, required: true, trim: true },
    commonNames: [{ type: String, trim: true }],
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    originRegion: { type: String, required: true },
    harvestingMethod: { type: String, required: true },
    tasteNotes: [{ type: String }],
    sensoryAroma: { type: String, required: true },
    traditionalUses: [{ type: String }],
    image: { type: String, required: true },
    bannerImage: { type: String, required: true },
    healthDisclaimer: {
      type: String,
      default: 'This product is an artisanal food and beverage ingredient and is not intended to diagnose, treat, cure, or prevent any disease.',
    },
    heroQuote: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const BotanicalIngredient = mongoose.model<IBotanicalIngredient>('BotanicalIngredient', BotanicalIngredientSchema);

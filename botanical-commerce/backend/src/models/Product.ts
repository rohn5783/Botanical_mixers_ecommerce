import mongoose, { Document, Schema } from 'mongoose';
import { IProductVariant, IFlavourProfile, IDilutionRatio, INutritionalInfo } from '../types/index.js';

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: mongoose.Types.ObjectId;
  botanicalIngredient?: mongoose.Types.ObjectId;
  images: string[];
  variants: IProductVariant[];
  ingredientsList: string[];
  flavourProfile: IFlavourProfile;
  dilutionRatio: IDilutionRatio;
  estimatedServingsPerBottle: number;
  nutritionalInfo: INutritionalInfo;
  allergenInfo: string;
  storageInstructions: string;
  shelfLifeMonths: number;
  fssaiLicenseNumber: string;
  originRegion: string;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  ratingAverage: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: false },
  volumeMl: { type: Number, required: true },
  priceInPaise: { type: Number, required: true, min: 0 },
  compareAtPriceInPaise: { type: Number, min: 0 },
  stock: { type: Number, required: true, default: 0 },
  barcode: { type: String },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    botanicalIngredient: { type: Schema.Types.ObjectId, ref: 'BotanicalIngredient', index: true },
    images: [{ type: String, required: true }],
    variants: [VariantSchema],
    ingredientsList: [{ type: String }],
    flavourProfile: {
      sweet: { type: Number, min: 1, max: 5, default: 3 },
      tart: { type: Number, min: 1, max: 5, default: 3 },
      aromatic: { type: Number, min: 1, max: 5, default: 3 },
      herbal: { type: Number, min: 1, max: 5, default: 3 },
      astringent: { type: Number, min: 1, max: 5, default: 3 },
      description: { type: String, default: '' },
    },
    dilutionRatio: {
      concentrateParts: { type: Number, default: 1 },
      waterOrSodaParts: { type: Number, default: 5 },
      recommendedRatioText: { type: String, default: '1:5 ratio with chilled soda or water' },
      servingSizeMl: { type: Number, default: 30 },
    },
    estimatedServingsPerBottle: { type: Number, default: 16 },
    nutritionalInfo: {
      servingSizeMl: { type: Number, default: 30 },
      energyKcal: { type: Number, default: 45 },
      carbohydratesG: { type: Number, default: 11 },
      sugarG: { type: Number, default: 9 },
      addedSugarG: { type: Number, default: 0 },
      proteinG: { type: Number, default: 0.2 },
      fatG: { type: Number, default: 0 },
      sodiumMg: { type: Number, default: 12 },
    },
    allergenInfo: { type: String, default: 'Manufactured in a dedicated botanical beverage facility. Free from gluten, dairy, and nuts.' },
    storageInstructions: { type: String, default: 'Store in a cool, dry place away from direct sunlight. Refrigerate after opening and consume within 45 days.' },
    shelfLifeMonths: { type: Number, default: 12 },
    fssaiLicenseNumber: { type: String, default: '10021043000842' },
    originRegion: { type: String, default: 'Western Ghats, India' },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    tags: [{ type: String }],
    ratingAverage: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

import { z } from 'zod';
import { UserRole, BusinessType, RecipeCategory, RecipeDifficulty } from '../types/index.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum([UserRole.CUSTOMER, UserRole.B2B_CUSTOMER]).default(UserRole.CUSTOMER),
  companyName: z.string().optional(),
  gstin: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address required'),
  password: z.string().min(1, 'Password is required'),
});

export const b2bEnquirySchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Valid work email required'),
  phone: z.string().min(10, 'Valid 10-digit phone number required'),
  businessType: z.nativeEnum(BusinessType),
  gstin: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  estimatedMonthlyVolumeLiters: z.number().min(5, 'Minimum 5 Liters monthly volume'),
  interestedProducts: z.array(z.string()).optional(),
  message: z.string().min(10, 'Please describe your beverage program or requirements'),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantSku: z.string().min(1, 'Variant SKU is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  guestToken: z.string().optional(),
});

export const checkoutSchema = z.object({
  customerEmail: z.string().email('Valid email required'),
  customerPhone: z.string().min(10, 'Valid 10-digit phone number required'),
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(10, 'Phone is required'),
    streetAddress: z.string().min(5, 'Street address is required'),
    apartment: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(4, 'Postal code is required'),
    country: z.string().default('India'),
  }),
  cartId: z.string().optional(),
  guestToken: z.string().optional(),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
});

export const paymentVerifySchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
});

export const productCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  category: z.string().min(1),
  botanicalIngredient: z.string().optional(),
  images: z.array(z.string()).min(1),
  variants: z.array(
    z.object({
      name: z.string(),
      sku: z.string(),
      volumeMl: z.number().positive(),
      priceInPaise: z.number().int().nonnegative(),
      compareAtPriceInPaise: z.number().int().nonnegative().optional(),
      stock: z.number().int().nonnegative(),
      barcode: z.string().optional(),
    })
  ).min(1),
  ingredientsList: z.array(z.string()).default([]),
  flavourProfile: z.object({
    sweet: z.number().min(1).max(5),
    tart: z.number().min(1).max(5),
    aromatic: z.number().min(1).max(5),
    herbal: z.number().min(1).max(5),
    astringent: z.number().min(1).max(5),
    description: z.string(),
  }),
  dilutionRatio: z.object({
    concentrateParts: z.number().positive(),
    waterOrSodaParts: z.number().positive(),
    recommendedRatioText: z.string(),
    servingSizeMl: z.number().positive(),
  }),
  estimatedServingsPerBottle: z.number().positive(),
  nutritionalInfo: z.object({
    servingSizeMl: z.number().positive(),
    energyKcal: z.number().nonnegative(),
    carbohydratesG: z.number().nonnegative(),
    sugarG: z.number().nonnegative(),
    addedSugarG: z.number().nonnegative(),
    proteinG: z.number().nonnegative(),
    fatG: z.number().nonnegative(),
    sodiumMg: z.number().nonnegative(),
  }),
  allergenInfo: z.string().default('Gluten-free, vegan, nut-free.'),
  storageInstructions: z.string(),
  shelfLifeMonths: z.number().int().positive(),
  fssaiLicenseNumber: z.string().default('10021043000842'),
  originRegion: z.string(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

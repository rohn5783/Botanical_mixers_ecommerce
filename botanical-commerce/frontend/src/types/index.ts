export interface IProductVariant {
  name: string;
  sku: string;
  volumeMl: number;
  priceInPaise: number;
  compareAtPriceInPaise?: number;
  stock: number;
  barcode?: string;
}

export interface IFlavourProfile {
  sweet: number;
  tart: number;
  aromatic: number;
  herbal: number;
  astringent: number;
  description: string;
}

export interface IDilutionRatio {
  concentrateParts: number;
  waterOrSodaParts: number;
  recommendedRatioText: string;
  servingSizeMl: number;
}

export interface INutritionalInfo {
  servingSizeMl: number;
  energyKcal: number;
  carbohydratesG: number;
  sugarG: number;
  addedSugarG: number;
  proteinG: number;
  fatG: number;
  sodiumMg: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: { _id: string; name: string; slug: string };
  botanicalIngredient?: { _id: string; name: string; slug: string; originRegion: string };
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
}

export interface IBotanicalIngredient {
  _id: string;
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
}

export interface IRecipeIngredient {
  name: string;
  amount: string;
  unit: string;
  isBotanicalConcentrate: boolean;
  productRef?: string;
}

export interface IRecipeInstruction {
  stepNumber: number;
  title: string;
  text: string;
  proTip?: string;
}

export interface IRecipe {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  heroImage: string;
  category: 'MOCKTAIL' | 'SPARKLING' | 'LEMONADE' | 'ICED_BOTANICAL' | 'SIGNATURE';
  difficulty: 'EASY' | 'MEDIUM' | 'EXPERT';
  prepTimeMinutes: number;
  servingYield: number;
  requiredBotanicalProducts: IProduct[];
  ingredients: IRecipeIngredient[];
  instructions: IRecipeInstruction[];
  glassware: string;
  garnish: string;
  caloriesKcal: number;
  isFeatured: boolean;
}

export interface ICartItem {
  product: IProduct;
  variantSku: string;
  variantName: string;
  volumeMl: number;
  quantity: number;
  priceInPaise: number;
}

export interface ICart {
  _id: string;
  items: ICartItem[];
  couponCode?: string;
  discountInPaise: number;
  subtotalInPaise: number;
  totalAmountInPaise: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'B2B_CUSTOMER';
  phone?: string;
  companyName?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    product: string;
    productName: string;
    variantSku: string;
    variantName: string;
    volumeMl: number;
    unitPriceInPaise: number;
    quantity: number;
    totalPriceInPaise: number;
    image: string;
  }>;
  subtotalInPaise: number;
  taxInPaise: number;
  shippingFeeInPaise: number;
  discountInPaise: number;
  couponCode?: string;
  totalAmountInPaise: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  createdAt: string;
}

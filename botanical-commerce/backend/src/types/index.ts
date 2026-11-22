export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  B2B_CUSTOMER = 'B2B_CUSTOMER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum B2BStatus {
  NEW = 'NEW',
  UNDER_REVIEW = 'UNDER_REVIEW',
  QUOTATION_SENT = 'QUOTATION_SENT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum BusinessType {
  CAFE = 'CAFE',
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  MOCKTAIL_BAR = 'MOCKTAIL_BAR',
  CATERING = 'CATERING',
  DISTRIBUTOR = 'DISTRIBUTOR',
  OTHER = 'OTHER',
}

export enum RecipeCategory {
  MOCKTAIL = 'MOCKTAIL',
  SPARKLING = 'SPARKLING',
  LEMONADE = 'LEMONADE',
  ICED_BOTANICAL = 'ICED_BOTANICAL',
  SIGNATURE = 'SIGNATURE',
}

export enum RecipeDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  EXPERT = 'EXPERT',
}

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
  sweet: number; // 1-5
  tart: number;  // 1-5
  aromatic: number; // 1-5
  herbal: number; // 1-5
  astringent: number; // 1-5
  description: string;
}

export interface IDilutionRatio {
  concentrateParts: number; // e.g. 1
  waterOrSodaParts: number; // e.g. 5
  recommendedRatioText: string; // e.g. "1 part concentrate to 5 parts chilled soda or water"
  servingSizeMl: number; // e.g. 30 ml concentrate for a 180 ml drink
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

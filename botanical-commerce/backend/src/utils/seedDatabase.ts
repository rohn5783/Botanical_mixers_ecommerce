import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { BotanicalIngredient } from '../models/BotanicalIngredient.js';
import { Product } from '../models/Product.js';
import { Recipe } from '../models/Recipe.js';
import { Inventory } from '../models/Inventory.js';
import { Coupon } from '../models/Coupon.js';
import { B2BEnquiry } from '../models/B2BEnquiry.js';
import { hashPassword } from './password.js';
import { UserRole, BusinessType, RecipeCategory, RecipeDifficulty, B2BStatus } from '../types/index.js';
import { connectDatabase } from '../config/database.js';

export const seedDatabaseIfEmpty = async (): Promise<void> => {
  const productCount = await Product.countDocuments();
  if (productCount > 0) {
    console.log(`[Seed] Database already contains ${productCount} products. Skipping auto-seed.`);
    return;
  }
  console.log('[Seed] Database is empty. Seeding initial artisanal botanical dataset...');
  await runSeed();
};

export const runSeed = async (): Promise<void> => {
  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    BotanicalIngredient.deleteMany({}),
    Product.deleteMany({}),
    Recipe.deleteMany({}),
    Inventory.deleteMany({}),
    Coupon.deleteMany({}),
    B2BEnquiry.deleteMany({}),
  ]);

  console.log('[Seed] Cleared existing collections.');

  // 1. Create Users
  const adminPassword = await hashPassword('Botanicals@Admin2026');
  const customerPassword = await hashPassword('Customer@2026');
  const b2bPassword = await hashPassword('B2BPartner@2026');

  const admin = await User.create({
    name: 'Devendra Sharma',
    email: 'admin@aranyabotanicals.com',
    passwordHash: adminPassword,
    role: UserRole.ADMIN,
    phone: '+919820012345',
    isEmailVerified: true,
  });

  const customer = await User.create({
    name: 'Ananya Deshmukh',
    email: 'customer@aranyabotanicals.com',
    passwordHash: customerPassword,
    role: UserRole.CUSTOMER,
    phone: '+919811122233',
    isEmailVerified: true,
  });

  const b2bUser = await User.create({
    name: 'Vikram Mehta',
    email: 'partner@tajhotels.com',
    passwordHash: b2bPassword,
    role: UserRole.B2B_CUSTOMER,
    companyName: 'Taj Connoisseur Beverages & Hospitality',
    gstin: '27AABCT3518Q1ZV',
    phone: '+919822233344',
    isEmailVerified: true,
  });

  console.log('[Seed] Created default users (Admin, Customer, B2B).');

  // 2. Categories
  const categories = await Category.insertMany([
    {
      name: 'Kokum Concentrates',
      slug: 'kokum',
      description: 'Handcrafted tart and tangy botanical concentrates made from wild Western Ghats Garcinia indica.',
      image: '/images/categories/kokum.jpg',
      displayOrder: 1,
    },
    {
      name: 'Nannari Concentrates',
      slug: 'nannari',
      description: 'Slow-simmered Indian Sarsaparilla roots with rich earthy sweetness and authentic aromatic body.',
      image: '/images/categories/nannari.jpg',
      displayOrder: 2,
    },
    {
      name: 'Jamun Concentrates',
      slug: 'jamun',
      description: 'Rich velvet dark berry concentrates showcasing wild Konkan black plums with deep astringency.',
      image: '/images/categories/jamun.jpg',
      displayOrder: 3,
    },
    {
      name: 'Hibiscus Concentrates',
      slug: 'hibiscus',
      description: 'Ruby floral elixir pressed from fresh Malabar roselle calyces with bright tart notes.',
      image: '/images/categories/hibiscus.jpg',
      displayOrder: 4,
    },
    {
      name: 'Botanical Blends',
      slug: 'botanical-blends',
      description: 'Curated artisanal botanical pairings crafted for mixologists, mocktail bars, and home hosts.',
      image: '/images/categories/blends.jpg',
      displayOrder: 5,
    },
    {
      name: 'Discovery Kits & Bundles',
      slug: 'discovery-kits',
      description: 'Tasting flights and gift sets featuring our complete portfolio of regional Indian botanicals.',
      image: '/images/categories/kits.jpg',
      displayOrder: 6,
    },
  ]);

  const catMap = new Map(categories.map((c) => [c.slug, c._id]));

  // 3. Botanical Ingredients
  const botanicals = await BotanicalIngredient.insertMany([
    {
      name: 'Kokum',
      scientificName: 'Garcinia indica',
      commonNames: ['Vrikshamla', 'Muringel', 'Bindin', 'Black Kokum'],
      slug: 'kokum',
      originRegion: 'Western Ghats, Maharashtra & Goa, India',
      harvestingMethod: 'Wild hand-harvested ripe fruits, sun-dried rinds infused in traditional slow reductions.',
      tasteNotes: ['Sharp Tartness', 'Earthy Fruitiness', 'Subtle Savory Pungency', 'Refreshing Acidity'],
      sensoryAroma: 'Piquant, tart-fruity with delicate woodsy undertones.',
      traditionalUses: [
        'Ayurvedic cooling summer preparation',
        'Digestive Solkadhi after rich meals',
        'Traditional piquant curries and sherbets',
      ],
      image: '/images/botanicals/kokum-detail.jpg',
      bannerImage: '/images/botanicals/kokum-banner.jpg',
      heroQuote: 'The jewel of the Western Ghats—providing natural hydroxycitric balance and an unmistakable bright ruby hue.',
      isActive: true,
    },
    {
      name: 'Nannari Root',
      scientificName: 'Hemidesmus indicus',
      commonNames: ['Indian Sarsaparilla', 'Anantamula', 'Naruneendi', 'Sugandhi'],
      slug: 'nannari',
      originRegion: 'Eastern Ghats foothills, Tamil Nadu & Andhra Pradesh, India',
      harvestingMethod: 'Aromatic roots sustainably unearthed during dry autumn, sun-cured, and slowly decocted in reverse-osmosis copper vats.',
      tasteNotes: ['Deep Vanilla Sweetness', 'Aromatic Root Earthiness', 'Balsamic Undertones', 'Cooling Finish'],
      sensoryAroma: 'Sweet woody bouquet with warm hints of vanilla, sweetgrass, and wintergreen.',
      traditionalUses: [
        'Venerated Pitta-cooling rasayana in Siddha & Ayurveda',
        'Classic heritage Nannari Sherbet served in brass cups',
        'Herbal restorative infusions across Southern India',
      ],
      image: '/images/botanicals/nannari-detail.jpg',
      bannerImage: '/images/botanicals/nannari-banner.jpg',
      heroQuote: 'An ancient aromatic root that delivers natural sweetness, profound herbal cooling, and velvety warmth.',
      isActive: true,
    },
    {
      name: 'Jamun',
      scientificName: 'Syzygium cumini',
      commonNames: ['Indian Blackberry', 'Java Plum', 'Black Plum', 'Jambul'],
      slug: 'jamun',
      originRegion: 'Konkan Coast & Deccan Plateau, Maharashtra, India',
      harvestingMethod: 'Gathered at peak summer ripeness, deseeded, and cold-extracted to preserve the deep anthocyanin pigments and authentic astringency.',
      tasteNotes: ['Velvet Sweet-Tart', 'Puckering Astringency', 'Dark Berry Richness', 'Tannic Complexity'],
      sensoryAroma: 'Rich dark plum and wild berry musk with subtle earthy tannins.',
      traditionalUses: [
        'Summer refreshing sherbet and spiced Kala Khatta street drinks',
        'Celebrated in Ayurvedic texts for glycemic harmony and digestion',
        'Tart fruit compotes and celebratory ceremonial elixirs',
      ],
      image: '/images/botanicals/jamun-detail.jpg',
      bannerImage: '/images/botanicals/jamun-banner.jpg',
      heroQuote: 'Dark, velvety, and unapologetically bold—capturing the nostalgic soul of monsoon berries.',
      isActive: true,
    },
    {
      name: 'Indian Hibiscus',
      scientificName: 'Hibiscus sabdariffa',
      commonNames: ['Roselle', 'Gongura Flower', 'Lal Ambari', 'Red Sorrel'],
      slug: 'hibiscus',
      originRegion: 'Malabar Coast & Nilgiri Foothills, Kerala, India',
      harvestingMethod: 'Fleshy crimson calyces harvested post-bloom, gently shade-dried, and steeped in small micro-batches with organic whole botanicals.',
      tasteNotes: ['Cranberry-Like Tartness', 'Floral Brightness', 'Citrus Zing', 'Crisp Clean Finish'],
      sensoryAroma: 'Bright floral bouquet with lively notes of pomegranate and red berries.',
      traditionalUses: [
        'Refreshing botanical cooling punch across tropical coasts',
        'Infused floral teas and festive celebratory cordials',
        'Natural vibrant culinary coloring and digestive tonic',
      ],
      image: '/images/botanicals/hibiscus-detail.jpg',
      bannerImage: '/images/botanicals/hibiscus-banner.jpg',
      heroQuote: 'A radiant ruby blossom yielding vivid acidity, sophisticated floral aromas, and modern mixology flair.',
      isActive: true,
    },
  ]);

  const botMap = new Map(botanicals.map((b) => [b.slug, b._id]));

  // 4. Products
  const products = await Product.insertMany([
    {
      name: 'Wild Western Ghats Kokum Concentrate',
      slug: 'wild-western-ghats-kokum-concentrate',
      shortDescription: 'Unsweetened pure botanical concentrate pressed from sun-cured Western Ghats Garcinia indica.',
      description: 'Crafted from hand-harvested wild Kokum rinds from the biodiversity hotspot of the Western Ghats. Slowly reduced with a touch of roasted rock cumin and coastal sea salt to highlight its natural, mouthwatering tartness. Designed for professional bar craft, fine cafes, and zero-proof mixology.',
      category: catMap.get('kokum'),
      botanicalIngredient: botMap.get('kokum'),
      images: [
        '/images/products/kokum-bottle-main.jpg',
        '/images/products/kokum-serve-glass.jpg',
        '/images/products/kokum-harvest.jpg',
      ],
      variants: [
        {
          name: '250ml Tasting Bottle',
          sku: 'AB-KOKUM-250',
          volumeMl: 250,
          priceInPaise: 44900, // ₹449
          compareAtPriceInPaise: 49900,
          stock: 150,
          barcode: '8906012345011',
        },
        {
          name: '500ml Heritage Glass Bottle',
          sku: 'AB-KOKUM-500',
          volumeMl: 500,
          priceInPaise: 74900, // ₹749
          compareAtPriceInPaise: 84900,
          stock: 220,
          barcode: '8906012345012',
        },
        {
          name: '1000ml Commercial Cafe Barista Pack',
          sku: 'AB-KOKUM-1000',
          volumeMl: 1000,
          priceInPaise: 129900, // ₹1,299
          compareAtPriceInPaise: 149900,
          stock: 85,
          barcode: '8906012345013',
        },
      ],
      ingredientsList: [
        'Wild Kokum Rind Reduction (Garcinia indica)',
        'Purified Spring Water',
        'Raw Organic Khandsari Sugar (Minimal Balance)',
        'Hand-Roasted Bhuna Cumin',
        'Black Himalayan Rock Salt',
      ],
      flavourProfile: {
        sweet: 2,
        tart: 5,
        aromatic: 4,
        herbal: 3,
        astringent: 2,
        description: 'Vibrant, sharp tartness backed by warm roasted spice and natural savory undertones.',
      },
      dilutionRatio: {
        concentrateParts: 1,
        waterOrSodaParts: 5,
        recommendedRatioText: '1 part concentrate (30ml) to 5 parts chilled sparkling water or club soda (150ml).',
        servingSizeMl: 30,
      },
      estimatedServingsPerBottle: 16,
      nutritionalInfo: {
        servingSizeMl: 30,
        energyKcal: 38,
        carbohydratesG: 9,
        sugarG: 7.5,
        addedSugarG: 4.5,
        proteinG: 0.1,
        fatG: 0,
        sodiumMg: 18,
      },
      allergenInfo: 'Completely allergen-free. Manufactured in a 100% vegetarian botanical facility.',
      storageInstructions: 'Keep in a cool, shaded larder. Refrigerate after opening and enjoy within 45 days.',
      shelfLifeMonths: 12,
      fssaiLicenseNumber: '10021043000842',
      originRegion: 'Western Ghats, Maharashtra & Goa',
      isPublished: true,
      isFeatured: true,
      tags: ['Kokum', 'Digestive', 'Tart', 'Sparkling', 'Zero-Proof', 'Bestseller'],
      ratingAverage: 4.9,
      reviewCount: 48,
    },
    {
      name: 'Heritage Nannari Root Botanical Concentrate',
      slug: 'heritage-nannari-root-botanical-concentrate',
      shortDescription: 'Slow-simmered aromatic Indian Sarsaparilla roots with wild honey undertones and deep herbal cooling.',
      description: 'Our signature botanical tribute to the venerated Indian Sarsaparilla. Whole fibrous roots are harvested by partner tribal foragers in Tamil Nadu and Andhra Pradesh, dried in morning sunshine, and decocted over 14 hours in micro-batches. Yields a rich amber concentrate with natural balsamic-vanilla aromatic presence.',
      category: catMap.get('nannari'),
      botanicalIngredient: botMap.get('nannari'),
      images: [
        '/images/products/nannari-bottle-main.jpg',
        '/images/products/nannari-serve-glass.jpg',
        '/images/products/nannari-roots.jpg',
      ],
      variants: [
        {
          name: '250ml Tasting Bottle',
          sku: 'AB-NANNARI-250',
          volumeMl: 250,
          priceInPaise: 44900,
          compareAtPriceInPaise: 49900,
          stock: 140,
          barcode: '8906012345021',
        },
        {
          name: '500ml Heritage Glass Bottle',
          sku: 'AB-NANNARI-500',
          volumeMl: 500,
          priceInPaise: 74900,
          compareAtPriceInPaise: 84900,
          stock: 195,
          barcode: '8906012345022',
        },
        {
          name: '1000ml Commercial Cafe Barista Pack',
          sku: 'AB-NANNARI-1000',
          volumeMl: 1000,
          priceInPaise: 129900,
          compareAtPriceInPaise: 149900,
          stock: 90,
          barcode: '8906012345023',
        },
      ],
      ingredientsList: [
        'Aromatic Nannari Root Decoction (Hemidesmus indicus)',
        'Purified Water',
        'Raw Cane Jaggery & Unrefined Khandsari',
        'Cold-Pressed Lime Zest',
        'Crushed Green Cardamom Pods',
      ],
      flavourProfile: {
        sweet: 4,
        tart: 1,
        aromatic: 5,
        herbal: 5,
        astringent: 1,
        description: 'Complex root bouquet, lingering sweet vanilla-balsam aroma, and deeply soothing cooling aftertaste.',
      },
      dilutionRatio: {
        concentrateParts: 1,
        waterOrSodaParts: 5,
        recommendedRatioText: '1 part concentrate (30ml) to 5 parts ice-chilled still water or sparkling soda, with a squeeze of fresh lemon.',
        servingSizeMl: 30,
      },
      estimatedServingsPerBottle: 16,
      nutritionalInfo: {
        servingSizeMl: 30,
        energyKcal: 42,
        carbohydratesG: 10.5,
        sugarG: 9.0,
        addedSugarG: 5.0,
        proteinG: 0.1,
        fatG: 0,
        sodiumMg: 10,
      },
      allergenInfo: 'Free from common allergens, preservatives, and synthetic aromas.',
      storageInstructions: 'Store sealed in a dry environment. Keep refrigerated once opened; best consumed within 60 days.',
      shelfLifeMonths: 12,
      fssaiLicenseNumber: '10021043000842',
      originRegion: 'Eastern Ghats, Tamil Nadu',
      isPublished: true,
      isFeatured: true,
      tags: ['Nannari', 'Sarsaparilla', 'Heritage', 'Cooling', 'Summer', 'Artisanal'],
      ratingAverage: 4.95,
      reviewCount: 62,
    },
    {
      name: 'Konkan Jamun Velvet Concentrate',
      slug: 'konkan-jamun-velvet-concentrate',
      shortDescription: 'Pure cold-reduced dark black plum with natural tannins, wild pink peppercorn, and tangy kala khatta essence.',
      description: 'Extracted from ripe, deep-purple Indian wild black plums sourced along the rain-drenched Konkan coast. Hand-pitted and slowly pressed to extract intense anthocyanin pigments. Infused with black salt, wild pink peppercorn, and toasted cumin for a modern luxury reboot of the timeless Kala Khatta profile.',
      category: catMap.get('jamun'),
      botanicalIngredient: botMap.get('jamun'),
      images: [
        '/images/products/jamun-bottle-main.jpg',
        '/images/products/jamun-serve-glass.jpg',
        '/images/products/jamun-fruits.jpg',
      ],
      variants: [
        {
          name: '250ml Tasting Bottle',
          sku: 'AB-JAMUN-250',
          volumeMl: 250,
          priceInPaise: 49900,
          compareAtPriceInPaise: 54900,
          stock: 120,
          barcode: '8906012345031',
        },
        {
          name: '500ml Heritage Glass Bottle',
          sku: 'AB-JAMUN-500',
          volumeMl: 500,
          priceInPaise: 79900,
          compareAtPriceInPaise: 89900,
          stock: 180,
          barcode: '8906012345032',
        },
        {
          name: '1000ml Commercial Cafe Barista Pack',
          sku: 'AB-JAMUN-1000',
          volumeMl: 1000,
          priceInPaise: 139900,
          compareAtPriceInPaise: 159900,
          stock: 65,
          barcode: '8906012345033',
        },
      ],
      ingredientsList: [
        'Konkan Wild Jamun Pure Fruit Extract (Syzygium cumini)',
        'Purified Spring Water',
        'Organic Raw Sugar (Minimal)',
        'Rock Salt & Black Salt (Kala Namak)',
        'Crushed Kerala Pink Peppercorns',
      ],
      flavourProfile: {
        sweet: 3,
        tart: 4,
        aromatic: 4,
        herbal: 2,
        astringent: 5,
        description: 'Plush velvet dark berry notes followed by classic palate-gripping astringency and savory spice.',
      },
      dilutionRatio: {
        concentrateParts: 1,
        waterOrSodaParts: 5,
        recommendedRatioText: '1 part concentrate (30ml) to 5 parts club soda or tonic water over crushed ice.',
        servingSizeMl: 30,
      },
      estimatedServingsPerBottle: 16,
      nutritionalInfo: {
        servingSizeMl: 30,
        energyKcal: 36,
        carbohydratesG: 8.8,
        sugarG: 7.2,
        addedSugarG: 3.5,
        proteinG: 0.2,
        fatG: 0,
        sodiumMg: 22,
      },
      allergenInfo: 'Zero synthetic dyes, zero artificial preservatives.',
      storageInstructions: 'Refrigerate upon opening. Shake gently before pouring.',
      shelfLifeMonths: 12,
      fssaiLicenseNumber: '10021043000842',
      originRegion: 'Konkan Coast, Maharashtra',
      isPublished: true,
      isFeatured: true,
      tags: ['Jamun', 'Kala Khatta', 'Bold', 'Tannic', 'Mocktail Bar'],
      ratingAverage: 4.85,
      reviewCount: 39,
    },
    {
      name: 'Malabar Wild Hibiscus Roselle Concentrate',
      slug: 'malabar-wild-hibiscus-roselle-concentrate',
      shortDescription: 'Luminescent ruby elixir crafted from coastal roselle blossoms with crisp tartness and fresh ginger peel.',
      description: 'Hand-picked organic crimson hibiscus calyces sourced from family-run agroforestry estates in Malabar, Kerala. Cold-extracted with fragrant crushed green cardamom and mountain ginger rind to produce a brilliant garnet concentrate with crisp cranberry-citrus acidity.',
      category: catMap.get('hibiscus'),
      botanicalIngredient: botMap.get('hibiscus'),
      images: [
        '/images/products/hibiscus-bottle-main.jpg',
        '/images/products/hibiscus-serve-glass.jpg',
        '/images/products/hibiscus-flower.jpg',
      ],
      variants: [
        {
          name: '250ml Tasting Bottle',
          sku: 'AB-HIBISCUS-250',
          volumeMl: 250,
          priceInPaise: 44900,
          compareAtPriceInPaise: 49900,
          stock: 135,
          barcode: '8906012345041',
        },
        {
          name: '500ml Heritage Glass Bottle',
          sku: 'AB-HIBISCUS-500',
          volumeMl: 500,
          priceInPaise: 74900,
          compareAtPriceInPaise: 84900,
          stock: 210,
          barcode: '8906012345042',
        },
        {
          name: '1000ml Commercial Cafe Barista Pack',
          sku: 'AB-HIBISCUS-1000',
          volumeMl: 1000,
          priceInPaise: 129900,
          compareAtPriceInPaise: 149900,
          stock: 75,
          barcode: '8906012345043',
        },
      ],
      ingredientsList: [
        'Malabar Hibiscus Calyx Infusion (Hibiscus sabdariffa)',
        'Purified Water',
        'Raw Khandsari Sugar',
        'Fresh Mountain Ginger Extract',
        'Organic Sweet Cinnamon Bark',
      ],
      flavourProfile: {
        sweet: 3,
        tart: 5,
        aromatic: 5,
        herbal: 3,
        astringent: 2,
        description: 'Vibrant cranberry zing, delicate floral sweetness, and crisp warming ginger resonance.',
      },
      dilutionRatio: {
        concentrateParts: 1,
        waterOrSodaParts: 5,
        recommendedRatioText: '1 part concentrate (30ml) to 5 parts sparkling soda or tonic water with a fresh rosemary sprig.',
        servingSizeMl: 30,
      },
      estimatedServingsPerBottle: 16,
      nutritionalInfo: {
        servingSizeMl: 30,
        energyKcal: 40,
        carbohydratesG: 9.8,
        sugarG: 8.2,
        addedSugarG: 4.0,
        proteinG: 0.1,
        fatG: 0,
        sodiumMg: 8,
      },
      allergenInfo: 'Natural floral ingredient. No sulfites or synthetic food coloring.',
      storageInstructions: 'Store in a cool dry space. Refrigerate after opening.',
      shelfLifeMonths: 12,
      fssaiLicenseNumber: '10021043000842',
      originRegion: 'Malabar Coast, Kerala',
      isPublished: true,
      isFeatured: true,
      tags: ['Hibiscus', 'Roselle', 'Floral', 'Ruby', 'Cocktail Mixer'],
      ratingAverage: 4.88,
      reviewCount: 44,
    },
    {
      name: 'The Four Botanicals Discovery Box',
      slug: 'the-four-botanicals-discovery-box',
      shortDescription: 'The ultimate tasting flight containing all four signature Indian botanical concentrates in 250ml glass decanters.',
      description: 'An elegant gift collection featuring Western Ghats Kokum, Heritage Nannari Root, Konkan Jamun Velvet, and Malabar Wild Hibiscus. Packed in an unbleached linen gift box accompanied by a recipe manual and artisanal jigger.',
      category: catMap.get('discovery-kits'),
      images: [
        '/images/products/discovery-box-main.jpg',
        '/images/products/discovery-box-open.jpg',
        '/images/products/discovery-box-bottles.jpg',
      ],
      variants: [
        {
          name: 'Discovery Tasting Flight (4 x 250ml Bottles)',
          sku: 'AB-KIT-DISCOVERY-4X250',
          volumeMl: 1000,
          priceInPaise: 169900, // ₹1,699 (bundled savings)
          compareAtPriceInPaise: 199900,
          stock: 80,
          barcode: '8906012345099',
        },
      ],
      ingredientsList: [
        '1x Wild Western Ghats Kokum (250ml)',
        '1x Heritage Nannari Root (250ml)',
        '1x Konkan Jamun Velvet (250ml)',
        '1x Malabar Wild Hibiscus (250ml)',
        'Printed Botanical Mixology Guidebook',
      ],
      flavourProfile: {
        sweet: 3,
        tart: 4,
        aromatic: 5,
        herbal: 4,
        astringent: 3,
        description: 'Complete exploration across tart, aromatic, tannic, and floral taste dimensions.',
      },
      dilutionRatio: {
        concentrateParts: 1,
        waterOrSodaParts: 5,
        recommendedRatioText: 'Standard 1:5 ratio makes up to 32 artisanal drinks.',
        servingSizeMl: 30,
      },
      estimatedServingsPerBottle: 32,
      nutritionalInfo: {
        servingSizeMl: 30,
        energyKcal: 39,
        carbohydratesG: 9.5,
        sugarG: 8.0,
        addedSugarG: 4.2,
        proteinG: 0.1,
        fatG: 0,
        sodiumMg: 12,
      },
      allergenInfo: 'Allergen-free, vegan certified.',
      storageInstructions: 'Keep in cool dry environment. Refrigerate bottles once unsealed.',
      shelfLifeMonths: 12,
      fssaiLicenseNumber: '10021043000842',
      originRegion: 'Pan-Indian Botanical Sourcing',
      isPublished: true,
      isFeatured: true,
      tags: ['Gift Box', 'Discovery Kit', 'Bundle', 'Tasting Flight'],
      ratingAverage: 5.0,
      reviewCount: 57,
    },
    {
      name: 'Cafe Barista & Mixologist Starter Trio',
      slug: 'cafe-barista-mixologist-starter-trio',
      shortDescription: 'Three commercial 1000ml barista packs designed for specialty beverage programs and high-volume craft bars.',
      description: 'Selected by premier cocktail bars and boutique cafes across Mumbai, Bengaluru, and Delhi. Features 1 Liter barista jugs of Kokum, Nannari, and Hibiscus equipped with measured 10ml pump dispensers for consistent beverage engineering.',
      category: catMap.get('botanical-blends'),
      images: [
        '/images/products/barista-trio-main.jpg',
        '/images/products/barista-pumps.jpg',
      ],
      variants: [
        {
          name: 'Professional Barista Trio (3 x 1000ml)',
          sku: 'AB-TRIO-COMMERCIAL-3X1000',
          volumeMl: 3000,
          priceInPaise: 349900, // ₹3,499
          compareAtPriceInPaise: 389900,
          stock: 45,
          barcode: '8906012345098',
        },
      ],
      ingredientsList: [
        '1x Wild Western Ghats Kokum (1000ml)',
        '1x Heritage Nannari Root (1000ml)',
        '1x Malabar Wild Hibiscus (1000ml)',
        '3x Food-Grade Measured Pump Dispensers (10ml)',
      ],
      flavourProfile: {
        sweet: 3,
        tart: 4,
        aromatic: 5,
        herbal: 4,
        astringent: 2,
        description: 'Comprehensive flavor arsenal covering refreshing spritzes, herbal tonics, and iced teas.',
      },
      dilutionRatio: {
        concentrateParts: 1,
        waterOrSodaParts: 5,
        recommendedRatioText: 'High yield: Produces approximately 100 drinks of 180ml each.',
        servingSizeMl: 30,
      },
      estimatedServingsPerBottle: 100,
      nutritionalInfo: {
        servingSizeMl: 30,
        energyKcal: 40,
        carbohydratesG: 9.6,
        sugarG: 8.1,
        addedSugarG: 4.4,
        proteinG: 0.1,
        fatG: 0,
        sodiumMg: 14,
      },
      allergenInfo: 'Vegetarian, pure plant-based formulation.',
      storageInstructions: 'Store in dry cafe stockroom. Ambient storage unopened.',
      shelfLifeMonths: 12,
      fssaiLicenseNumber: '10021043000842',
      originRegion: 'Pan-Indian Botanical Sourcing',
      isPublished: true,
      isFeatured: false,
      tags: ['B2B', 'Cafe Starter', 'Commercial', 'Barista'],
      ratingAverage: 4.92,
      reviewCount: 28,
    },
  ]);

  console.log(`[Seed] Created ${products.length} botanical products with variants.`);

  // 5. Initialize Inventory
  for (const p of products) {
    for (const v of p.variants) {
      await Inventory.create({
        product: p._id,
        variantSku: v.sku,
        availableStock: v.stock,
        reservedStock: 0,
        lowStockThreshold: 20,
        reorderPoint: 50,
        history: [{ changeAmount: v.stock, reason: 'Initial seed stock', timestamp: new Date() }],
      });
    }
  }

  // 6. Recipes
  const kokumProduct = products.find((p) => p.slug.includes('kokum'))!;
  const nannariProduct = products.find((p) => p.slug.includes('nannari'))!;
  const jamunProduct = products.find((p) => p.slug.includes('jamun'))!;
  const hibiscusProduct = products.find((p) => p.slug.includes('hibiscus'))!;

  await Recipe.insertMany([
    {
      title: 'Malabar Kokum Sparkling Highball',
      slug: 'malabar-kokum-sparkling-highball',
      subtitle: 'A revitalizing effervescent aperitif with crushed mint and pink rock salt',
      description: 'The definitive summer refresher. Our tart Western Ghats Kokum concentrate paired with artisanal club soda, fresh spearmint leaves, and a thin wheel of dehydrated lime.',
      heroImage: '/images/recipes/recipe-kokum-highball.jpg',
      category: RecipeCategory.SPARKLING,
      difficulty: RecipeDifficulty.EASY,
      prepTimeMinutes: 3,
      servingYield: 1,
      requiredBotanicalProducts: [kokumProduct._id],
      ingredients: [
        { name: 'Wild Western Ghats Kokum Concentrate', amount: '30', unit: 'ml', isBotanicalConcentrate: true, productRef: kokumProduct._id },
        { name: 'Chilled Club Soda or Sparkling Water', amount: '150', unit: 'ml', isBotanicalConcentrate: false },
        { name: 'Fresh Mint Leaves (Clapped)', amount: '6', unit: 'leaves', isBotanicalConcentrate: false },
        { name: 'Himalayan Pink Rock Salt', amount: '1', unit: 'pinch', isBotanicalConcentrate: false },
        { name: 'Clear Ice Cubes', amount: '4', unit: 'cubes', isBotanicalConcentrate: false },
      ],
      instructions: [
        {
          stepNumber: 1,
          title: 'Aromatize the Glassware',
          text: 'Fill a tall highball glass to the brim with clear ice cubes. Gently clap fresh mint leaves between your palms to release the essential oils and tuck into the ice.',
        },
        {
          stepNumber: 2,
          title: 'Pour Botanical Concentrate',
          text: 'Measure exactly 30ml of Wild Western Ghats Kokum Concentrate over the ice.',
          proTip: 'A measured jigger ensures ideal sweet-to-tart equilibrium.',
        },
        {
          stepNumber: 3,
          title: 'Effervescent Top & Garnish',
          text: 'Slowly pour 150ml of ice-cold sparkling soda down a barspoon to preserve carbonation. Give one gentle lift from the bottom, top with a pinch of pink salt, and garnish with a dehydrated lime wheel.',
        },
      ],
      glassware: '12 oz Cut-Glass Highball',
      garnish: 'Bruised mint sprig & dehydrated lime disc',
      caloriesKcal: 45,
      isFeatured: true,
    },
    {
      title: 'Heritage Nannari Sarsaparilla Cold Brew',
      slug: 'heritage-nannari-sarsaparilla-cold-brew',
      subtitle: 'Slow-steeped Southern Indian roots meet cold-extracted single origin Arabica',
      description: 'An extraordinary modern coffeehouse creation bridging heritage Ayurvedic cooling roots with specialty light-roast cold brew. Rich vanilla notes harmonize with chocolatey coffee notes.',
      heroImage: '/images/recipes/recipe-nannari-coldbrew.jpg',
      category: RecipeCategory.SIGNATURE,
      difficulty: RecipeDifficulty.MEDIUM,
      prepTimeMinutes: 4,
      servingYield: 1,
      requiredBotanicalProducts: [nannariProduct._id],
      ingredients: [
        { name: 'Heritage Nannari Root Concentrate', amount: '25', unit: 'ml', isBotanicalConcentrate: true, productRef: nannariProduct._id },
        { name: 'Specialty Light Roast Cold Brew Coffee', amount: '120', unit: 'ml', isBotanicalConcentrate: false },
        { name: 'Tonic Water or Soda', amount: '60', unit: 'ml', isBotanicalConcentrate: false },
        { name: 'Express Orange Peel', amount: '1', unit: 'strip', isBotanicalConcentrate: false },
      ],
      instructions: [
        {
          stepNumber: 1,
          title: 'Build in Rocks Glass',
          text: 'Add a single large ice sphere into a heavy-bottomed rocks glass.',
        },
        {
          stepNumber: 2,
          title: 'Layer Botanical Sweetness',
          text: 'Pour 25ml of Heritage Nannari Root Concentrate over the sphere.',
        },
        {
          stepNumber: 3,
          title: 'Cold Brew Infusion',
          text: 'Layer 120ml of chilled cold brew and top with 60ml of crisp tonic. Express the oils of an orange peel across the rim.',
        },
      ],
      glassware: 'Old Fashioned Rocks Glass',
      garnish: 'Flamed orange peel twist',
      caloriesKcal: 55,
      isFeatured: true,
    },
    {
      title: 'Konkan Kala Khatta Velvet Spritz',
      slug: 'konkan-kala-khatta-velvet-spritz',
      subtitle: 'A dramatic dark plum zero-proof spritz with black salt and crushed pink pepper',
      description: 'Taking the beloved nostalgia of beachside Kala Khatta into the realm of upscale cocktail lounges. Tart wild black plums, fine bubbles, and a savory rim.',
      heroImage: '/images/recipes/recipe-jamun-spritz.jpg',
      category: RecipeCategory.MOCKTAIL,
      difficulty: RecipeDifficulty.EASY,
      prepTimeMinutes: 3,
      servingYield: 1,
      requiredBotanicalProducts: [jamunProduct._id],
      ingredients: [
        { name: 'Konkan Jamun Velvet Concentrate', amount: '35', unit: 'ml', isBotanicalConcentrate: true, productRef: jamunProduct._id },
        { name: 'Chilled Indian Tonic Water', amount: '140', unit: 'ml', isBotanicalConcentrate: false },
        { name: 'Fresh Lime Juice', amount: '10', unit: 'ml', isBotanicalConcentrate: false },
        { name: 'Roasted Cumin Salt Rim', amount: '1', unit: 'serving', isBotanicalConcentrate: false },
      ],
      instructions: [
        {
          stepNumber: 1,
          title: 'Rim the Glass',
          text: 'Rub a lime wedge along half the rim of a stemless wine tumbler and dip into roasted cumin black salt.',
        },
        {
          stepNumber: 2,
          title: 'Combine & Stir',
          text: 'Add crushed ice, 35ml Konkan Jamun concentrate, and 10ml lime juice. Stir well.',
        },
        {
          stepNumber: 3,
          title: 'Tonic Top',
          text: 'Crown with chilled Indian tonic water for vibrant effervescence.',
        },
      ],
      glassware: 'Stemless Wine Tumbler',
      garnish: 'Half cumin-salt rim & crushed pink peppercorn',
      caloriesKcal: 52,
      isFeatured: true,
    },
    {
      title: 'Ruby Roselle Botanical Lemonade',
      slug: 'ruby-roselle-botanical-lemonade',
      subtitle: 'Coastal crimson hibiscus elixir paired with freshly crushed lemons and ginger',
      description: 'A dazzling ruby red cooler with an intoxicating floral bouquet. The ultimate zero-alcohol centerpiece for daytime gatherings, brunches, and fine dinners.',
      heroImage: '/images/recipes/recipe-hibiscus-lemonade.jpg',
      category: RecipeCategory.LEMONADE,
      difficulty: RecipeDifficulty.EASY,
      prepTimeMinutes: 3,
      servingYield: 1,
      requiredBotanicalProducts: [hibiscusProduct._id],
      ingredients: [
        { name: 'Malabar Wild Hibiscus Roselle Concentrate', amount: '30', unit: 'ml', isBotanicalConcentrate: true, productRef: hibiscusProduct._id },
        { name: 'Freshly Squeezed Lemon Juice', amount: '20', unit: 'ml', isBotanicalConcentrate: false },
        { name: 'Chilled Mountain Spring Water', amount: '140', unit: 'ml', isBotanicalConcentrate: false },
        { name: 'Fresh Rosemary Sprig', amount: '1', unit: 'sprig', isBotanicalConcentrate: false },
      ],
      instructions: [
        {
          stepNumber: 1,
          title: 'Prep Glass',
          text: 'Fill a goblet glass with crushed ice and slap a fresh rosemary sprig against the glass.',
        },
        {
          stepNumber: 2,
          title: 'Pour & Blend',
          text: 'Combine 30ml Hibiscus concentrate, 20ml lemon juice, and 140ml still spring water.',
        },
        {
          stepNumber: 3,
          title: 'Swizzle & Serve',
          text: 'Swizzle with a bar spoon and garnish with a lemon wheel and flaming rosemary sprig.',
        },
      ],
      glassware: 'Stemmed Goblet or Wine Glass',
      garnish: 'Rosemary sprig & fresh lemon wheel',
      caloriesKcal: 48,
      isFeatured: true,
    },
  ]);

  console.log('[Seed] Created signature botanical recipes.');

  // 7. Coupons
  await Coupon.insertMany([
    {
      code: 'BOTANICAL10',
      description: '10% discount on entire artisanal botanical order.',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValueInPaise: 50000, // ₹500
      maxDiscountInPaise: 30000,   // ₹300 max
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
      usageCount: 14,
      isActive: true,
    },
    {
      code: 'ARANYAWELCOME',
      description: 'Flat ₹150 off on your first botanical concentrate order.',
      discountType: 'FLAT_PAISE',
      discountValue: 15000, // ₹150
      minOrderValueInPaise: 99900, // ₹999
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      usageCount: 8,
      isActive: true,
    },
  ]);

  // 8. B2B Enquiry Sample
  await B2BEnquiry.create({
    businessName: 'The Imperial Cocktail & Mocktail Lounge',
    contactPerson: 'Siddharth Roy',
    email: 'beverage.director@imperialdelhi.in',
    phone: '+919811099887',
    businessType: BusinessType.MOCKTAIL_BAR,
    gstin: '07AAACI1234F1Z8',
    city: 'New Delhi',
    state: 'Delhi',
    estimatedMonthlyVolumeLiters: 60,
    interestedProducts: [kokumProduct._id, nannariProduct._id, jamunProduct._id],
    message: 'We are launching a dedicated Indian Terroir Botanical Mocktail menu and seek monthly commercial barista supply for Kokum, Nannari, and Jamun concentrates.',
    status: B2BStatus.NEW,
  });

  console.log('[Seed] Database initialization completed successfully!');
};

// Allow direct CLI execution if run via `tsx src/utils/seedDatabase.ts`
if (process.argv[1] && process.argv[1].includes('seedDatabase')) {
  connectDatabase()
    .then(() => runSeed())
    .then(() => {
      console.log('Seeding script finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding script failed:', err);
      process.exit(1);
    });
}

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Droplets, ShieldCheck, Award, GlassWater, Leaf, CheckCircle2, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { IProduct, IBotanicalIngredient, IRecipe } from '../types';
import styles from './page.module.scss';

// Fallback seed data in case backend server is spinning up or offline
const fallbackProducts: IProduct[] = [
  {
    _id: 'prod_kokum_1',
    name: 'Wild Western Ghats Kokum Concentrate',
    slug: 'wild-western-ghats-kokum-concentrate',
    shortDescription: 'Unsweetened pure botanical concentrate pressed from sun-cured Western Ghats Garcinia indica.',
    description: 'Crafted from hand-harvested wild Kokum rinds from the Western Ghats.',
    category: { _id: 'cat_1', name: 'Kokum Concentrates', slug: 'kokum' },
    images: ['https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { name: '500ml Heritage Glass Bottle', sku: 'AB-KOKUM-500', volumeMl: 500, priceInPaise: 74900, stock: 200 },
      { name: '250ml Tasting Bottle', sku: 'AB-KOKUM-250', volumeMl: 250, priceInPaise: 44900, stock: 150 },
    ],
    ingredientsList: ['Wild Kokum Rind Reduction', 'Purified Spring Water', 'Roasted Cumin', 'Black Salt'],
    flavourProfile: { sweet: 2, tart: 5, aromatic: 4, herbal: 3, astringent: 2, description: 'Tart, savory, and invigorating.' },
    dilutionRatio: { concentrateParts: 1, waterOrSodaParts: 5, recommendedRatioText: '1:5 ratio with chilled soda', servingSizeMl: 30 },
    estimatedServingsPerBottle: 16,
    nutritionalInfo: { servingSizeMl: 30, energyKcal: 38, carbohydratesG: 9, sugarG: 7.5, addedSugarG: 4.5, proteinG: 0.1, fatG: 0, sodiumMg: 18 },
    allergenInfo: 'Allergen-free, vegan certified.',
    storageInstructions: 'Refrigerate after opening.',
    shelfLifeMonths: 12,
    fssaiLicenseNumber: '10021043000842',
    originRegion: 'Western Ghats, Maharashtra & Goa',
    isPublished: true,
    isFeatured: true,
    tags: ['Kokum', 'Digestive', 'Tart'],
    ratingAverage: 4.9,
    reviewCount: 48,
  },
  {
    _id: 'prod_nannari_1',
    name: 'Heritage Nannari Root Botanical Concentrate',
    slug: 'heritage-nannari-root-botanical-concentrate',
    shortDescription: 'Slow-simmered aromatic Indian Sarsaparilla roots with wild honey undertones and deep herbal cooling.',
    description: 'Decocted over 14 hours in micro-batches with whole aromatic roots.',
    category: { _id: 'cat_2', name: 'Nannari Concentrates', slug: 'nannari' },
    images: ['https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { name: '500ml Heritage Glass Bottle', sku: 'AB-NANNARI-500', volumeMl: 500, priceInPaise: 74900, stock: 195 },
      { name: '250ml Tasting Bottle', sku: 'AB-NANNARI-250', volumeMl: 250, priceInPaise: 44900, stock: 140 },
    ],
    ingredientsList: ['Aromatic Nannari Root Decoction', 'Purified Spring Water', 'Raw Cane Jaggery', 'Cold-Pressed Lime Zest'],
    flavourProfile: { sweet: 4, tart: 1, aromatic: 5, herbal: 5, astringent: 1, description: 'Velvety vanilla-balsam aroma with intense herbal cooling.' },
    dilutionRatio: { concentrateParts: 1, waterOrSodaParts: 5, recommendedRatioText: '1:5 ratio with ice water or sparkling soda', servingSizeMl: 30 },
    estimatedServingsPerBottle: 16,
    nutritionalInfo: { servingSizeMl: 30, energyKcal: 42, carbohydratesG: 10.5, sugarG: 9, addedSugarG: 5, proteinG: 0.1, fatG: 0, sodiumMg: 10 },
    allergenInfo: 'Allergen-free, vegan certified.',
    storageInstructions: 'Refrigerate after opening.',
    shelfLifeMonths: 12,
    fssaiLicenseNumber: '10021043000842',
    originRegion: 'Eastern Ghats, Tamil Nadu',
    isPublished: true,
    isFeatured: true,
    tags: ['Nannari', 'Sarsaparilla', 'Heritage'],
    ratingAverage: 4.95,
    reviewCount: 62,
  },
  {
    _id: 'prod_jamun_1',
    name: 'Konkan Jamun Velvet Concentrate',
    slug: 'konkan-jamun-velvet-concentrate',
    shortDescription: 'Pure cold-reduced dark black plum with natural tannins, wild pink peppercorn, and tangy kala khatta essence.',
    description: 'Extracted from ripe, deep-purple Indian wild black plums.',
    category: { _id: 'cat_3', name: 'Jamun Concentrates', slug: 'jamun' },
    images: ['https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { name: '500ml Heritage Glass Bottle', sku: 'AB-JAMUN-500', volumeMl: 500, priceInPaise: 79900, stock: 180 },
    ],
    ingredientsList: ['Konkan Jamun Fruit Reduction', 'Rock Salt', 'Black Salt', 'Pink Peppercorns'],
    flavourProfile: { sweet: 3, tart: 4, aromatic: 4, herbal: 2, astringent: 5, description: 'Bold dark berries with palate-gripping astringency.' },
    dilutionRatio: { concentrateParts: 1, waterOrSodaParts: 5, recommendedRatioText: '1:5 ratio over crushed ice and tonic water', servingSizeMl: 30 },
    estimatedServingsPerBottle: 16,
    nutritionalInfo: { servingSizeMl: 30, energyKcal: 36, carbohydratesG: 8.8, sugarG: 7.2, addedSugarG: 3.5, proteinG: 0.2, fatG: 0, sodiumMg: 22 },
    allergenInfo: 'Zero synthetic dyes, zero preservatives.',
    storageInstructions: 'Refrigerate after opening.',
    shelfLifeMonths: 12,
    fssaiLicenseNumber: '10021043000842',
    originRegion: 'Konkan Coast, Maharashtra',
    isPublished: true,
    isFeatured: true,
    tags: ['Jamun', 'Kala Khatta', 'Tannic'],
    ratingAverage: 4.85,
    reviewCount: 39,
  },
  {
    _id: 'prod_hibiscus_1',
    name: 'Malabar Wild Hibiscus Roselle Concentrate',
    slug: 'malabar-wild-hibiscus-roselle-concentrate',
    shortDescription: 'Luminescent ruby elixir crafted from coastal roselle blossoms with crisp tartness and fresh ginger peel.',
    description: 'Organic crimson hibiscus calyces cold-extracted with crushed cardamom.',
    category: { _id: 'cat_4', name: 'Hibiscus Concentrates', slug: 'hibiscus' },
    images: ['https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { name: '500ml Heritage Glass Bottle', sku: 'AB-HIBISCUS-500', volumeMl: 500, priceInPaise: 74900, stock: 210 },
    ],
    ingredientsList: ['Malabar Hibiscus Calyces', 'Spring Water', 'Fresh Ginger Extract', 'Sweet Cinnamon Bark'],
    flavourProfile: { sweet: 3, tart: 5, aromatic: 5, herbal: 3, astringent: 2, description: 'Lively cranberry acidity and fragrant floral aroma.' },
    dilutionRatio: { concentrateParts: 1, waterOrSodaParts: 5, recommendedRatioText: '1:5 ratio with sparkling soda and rosemary', servingSizeMl: 30 },
    estimatedServingsPerBottle: 16,
    nutritionalInfo: { servingSizeMl: 30, energyKcal: 40, carbohydratesG: 9.8, sugarG: 8.2, addedSugarG: 4.0, proteinG: 0.1, fatG: 0, sodiumMg: 8 },
    allergenInfo: 'Natural floral ingredient.',
    storageInstructions: 'Refrigerate after opening.',
    shelfLifeMonths: 12,
    fssaiLicenseNumber: '10021043000842',
    originRegion: 'Malabar Coast, Kerala',
    isPublished: true,
    isFeatured: true,
    tags: ['Hibiscus', 'Roselle', 'Floral'],
    ratingAverage: 4.88,
    reviewCount: 44,
  },
];

const fallbackRecipes: IRecipe[] = [
  {
    _id: 'rec_1',
    title: 'Malabar Kokum Sparkling Highball',
    slug: 'malabar-kokum-sparkling-highball',
    subtitle: 'A revitalizing effervescent aperitif with crushed mint and pink rock salt',
    description: 'The definitive summer refresher.',
    heroImage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    category: 'SPARKLING',
    difficulty: 'EASY',
    prepTimeMinutes: 3,
    servingYield: 1,
    requiredBotanicalProducts: [fallbackProducts[0]],
    ingredients: [
      { name: 'Kokum Concentrate', amount: '30', unit: 'ml', isBotanicalConcentrate: true },
      { name: 'Chilled Club Soda', amount: '150', unit: 'ml', isBotanicalConcentrate: false },
    ],
    instructions: [{ stepNumber: 1, title: 'Fill with Ice', text: 'Fill glass with ice and pour 30ml concentrate.' }],
    glassware: 'Highball Glass',
    garnish: 'Fresh mint sprig',
    caloriesKcal: 45,
    isFeatured: true,
  },
  {
    _id: 'rec_2',
    title: 'Heritage Nannari Sarsaparilla Cold Brew',
    slug: 'heritage-nannari-sarsaparilla-cold-brew',
    subtitle: 'Slow-steeped Southern Indian roots meet cold-extracted single origin Arabica',
    description: 'Specialty coffeehouse creation bridging herbal cooling roots with cold brew.',
    heroImage: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    category: 'SIGNATURE',
    difficulty: 'MEDIUM',
    prepTimeMinutes: 4,
    servingYield: 1,
    requiredBotanicalProducts: [fallbackProducts[1]],
    ingredients: [
      { name: 'Nannari Concentrate', amount: '25', unit: 'ml', isBotanicalConcentrate: true },
      { name: 'Cold Brew Coffee', amount: '120', unit: 'ml', isBotanicalConcentrate: false },
    ],
    instructions: [{ stepNumber: 1, title: 'Layer Ingredients', text: 'Pour over large ice sphere.' }],
    glassware: 'Rocks Glass',
    garnish: 'Orange peel twist',
    caloriesKcal: 55,
    isFeatured: true,
  },
];

async function getHomeData(): Promise<{ products: IProduct[]; recipes: IRecipe[] }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const [prodRes, recipeRes] = await Promise.all([
      fetch(`${apiUrl}/products?limit=8`, { next: { revalidate: 60 } }),
      fetch(`${apiUrl}/recipes?limit=4`, { next: { revalidate: 60 } }),
    ]);

    const prodJson = prodRes.ok ? await prodRes.json() : null;
    const recipeJson = recipeRes.ok ? await recipeRes.json() : null;

    return {
      products: prodJson?.products?.length ? (prodJson.products as IProduct[]) : fallbackProducts,
      recipes: recipeJson?.data?.length ? (recipeJson.data as IRecipe[]) : fallbackRecipes,
    };
  } catch (error) {
    return {
      products: fallbackProducts,
      recipes: fallbackRecipes,
    };
  }
}

export default async function HomePage() {
  const { products, recipes } = await getHomeData();

  return (
    <div className={styles.home}>
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroLabel}>
              <Sparkles size={14} className={styles.sparkleIcon} />
              <span>INDIAN BOTANICAL TERROIR • COLD-REDUCED CONCENTRATES</span>
            </div>
            <h1 className={styles.heroTitle}>
              Real Indian Botanicals. <br />
              <em>Pure Liquid Craft.</em>
            </h1>
            <p className={styles.heroLead}>
              We craft potent, preservative-free beverage concentrates from Western Ghats Kokum, Tamil Nannari root, Konkan Jamun, and Malabar Hibiscus. Formulated for fine mixology, artisan cafes, and discerning hosts.
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop" className={styles.primaryHeroBtn}>
                Explore Concentrates <ArrowRight size={18} />
              </Link>
              <Link href="/drink-builder" className={styles.secondaryHeroBtn}>
                Try Interactive Drink Builder
              </Link>
            </div>

            {/* Badges Ribbon */}
            <div className={styles.heroTrustGrid}>
              <div className={styles.trustItem}>
                <span className={styles.trustNumber}>1:5</span>
                <span className={styles.trustLabel}>High-Yield Ratio (16+ Drinks/Bottle)</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <span className={styles.trustNumber}>100%</span>
                <span className={styles.trustLabel}>Wild Sourced Pure Extracts</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <span className={styles.trustNumber}>0%</span>
                <span className={styles.trustLabel}>Synthetic Flavours or Dyes</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroImageFrame}>
              <img
                src="https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=1000&q=80"
                alt="Aranya Botanicals Glassware Serve"
                className={styles.heroMainImg}
              />
              <div className={styles.heroFloatingCard}>
                <div className={styles.floatDot} />
                <div className={styles.floatText}>
                  <strong>Malabar Kokum Fizz</strong>
                  <span>30ml Kokum • 150ml Sparkling Soda • Pink Salt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 BOTANICAL PILLARS */}
      <section className={styles.botanicalPillars}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSubtitle}>FOUR SACRED INGREDIENTS</span>
            <h2 className={styles.sectionTitle}>The Terroir of Indian Botanicals</h2>
            <p className={styles.sectionDesc}>
              Before synthetic syrups flooded Indian beverages, regional roots, wild plums, and tropical flowers defined refreshing summer elixirs.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {/* Kokum */}
            <Link href="/botanicals/kokum" className={styles.pillarCard}>
              <div className={styles.pillarBadge} style={{ backgroundColor: '#932938' }}>01</div>
              <div className={styles.pillarImgWrapper}>
                <img src="https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=600&q=80" alt="Kokum" />
              </div>
              <h3>Kokum</h3>
              <span className={styles.botanicalSci}>Garcinia indica</span>
              <p>Wild-harvested across the misty Western Ghats. Intense natural tartness with cooling hydroxycitric acids.</p>
              <span className={styles.learnMore}>Explore Kokum Terroir →</span>
            </Link>

            {/* Nannari */}
            <Link href="/botanicals/nannari" className={styles.pillarCard}>
              <div className={styles.pillarBadge} style={{ backgroundColor: '#7A5435' }}>02</div>
              <div className={styles.pillarImgWrapper}>
                <img src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" alt="Nannari" />
              </div>
              <h3>Nannari Root</h3>
              <span className={styles.botanicalSci}>Hemidesmus indicus</span>
              <p>Ancient Southern Indian Sarsaparilla roots decocted over 14 hours. Deep sweet aroma and cooling rasayana.</p>
              <span className={styles.learnMore}>Explore Nannari Terroir →</span>
            </Link>

            {/* Jamun */}
            <Link href="/botanicals/jamun" className={styles.pillarCard}>
              <div className={styles.pillarBadge} style={{ backgroundColor: '#4E1D3B' }}>03</div>
              <div className={styles.pillarImgWrapper}>
                <img src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" alt="Jamun" />
              </div>
              <h3>Konkan Jamun</h3>
              <span className={styles.botanicalSci}>Syzygium cumini</span>
              <p>Velvet black plums with mouth-puckering natural tannins and savory Kala Khatta street nostalgia.</p>
              <span className={styles.learnMore}>Explore Jamun Terroir →</span>
            </Link>

            {/* Hibiscus */}
            <Link href="/botanicals/hibiscus" className={styles.pillarCard}>
              <div className={styles.pillarBadge} style={{ backgroundColor: '#A62B47' }}>04</div>
              <div className={styles.pillarImgWrapper}>
                <img src="https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80" alt="Hibiscus" />
              </div>
              <h3>Wild Hibiscus</h3>
              <span className={styles.botanicalSci}>Hibiscus sabdariffa</span>
              <p>Fleshy crimson roselle calyces from Malabar. Piquant cranberry zing, bright floral aromatics, and ruby hue.</p>
              <span className={styles.learnMore}>Explore Hibiscus Terroir →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS COLLECTION */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderBetween}>
            <div>
              <span className={styles.sectionSubtitle}>ARTISANAL COLLECTION</span>
              <h2 className={styles.sectionTitle}>Cold-Crafted Botanical Concentrates</h2>
            </div>
            <Link href="/shop" className={styles.viewAllBtn}>
              View Full Cellar ({products.length} Items) →
            </Link>
          </div>

          <div className={styles.productGrid}>
            {products.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY BOTANICAL CONCENTRATES? (EDUCATIONAL ARCHITECTURE) */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <div className={styles.whyTextCol}>
              <span className={styles.sectionSubtitle}>BEVERAGE PHILOSOPHY</span>
              <h2 className={styles.whyTitle}>Why Bottled Concentrates, Not Ready-To-Drink Cans?</h2>
              <p className={styles.whyLead}>
                Commercial canned beverages are 90% municipal water, artificial sweeteners, and synthetic preservatives shipped in high-carbon transport.
              </p>

              <div className={styles.reasonsList}>
                <div className={styles.reasonItem}>
                  <div className={styles.reasonIcon}><Droplets size={22} /></div>
                  <div>
                    <h4>Infinite Mixology Versatility</h4>
                    <p>Combine with cold still water, Himalayan sparkling soda, craft tonics, ginger beer, or cold brew.</p>
                  </div>
                </div>

                <div className={styles.reasonItem}>
                  <div className={styles.reasonIcon}><Award size={22} /></div>
                  <div>
                    <h4>Economic & Sustainable Yield</h4>
                    <p>One 500ml glass bottle replaces 16 single-use beverage cans, reducing packaging footprint by 84%.</p>
                  </div>
                </div>

                <div className={styles.reasonItem}>
                  <div className={styles.reasonIcon}><GlassWater size={22} /></div>
                  <div>
                    <h4>Personalized Sweetness Control</h4>
                    <p>Adjust dilution to your precise palate. Enjoy bold and tannic or light and crisp with simple dosage.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.whyVisualCol}>
              <div className={styles.comparisonTableCard}>
                <h3>The Botanical Quality Benchmark</h3>
                <table className={styles.compTable}>
                  <thead>
                    <tr>
                      <th>Attributes</th>
                      <th>Commercial Syrups</th>
                      <th className={styles.highlightHeader}>Aranya Concentrates</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Extraction Method</td>
                      <td>Chemical essence flavorings</td>
                      <td className={styles.highlightCell}>Cold-reduced whole plants</td>
                    </tr>
                    <tr>
                      <td>Sweetener</td>
                      <td>High fructose corn syrup</td>
                      <td className={styles.highlightCell}>Raw Khandsari & unrefined jaggery</td>
                    </tr>
                    <tr>
                      <td>Artificial Dyes</td>
                      <td>Tartrazine & Red 40</td>
                      <td className={styles.highlightCell}>100% Native anthocyanins</td>
                    </tr>
                    <tr>
                      <td>Dilution Ratio</td>
                      <td>1:3 (High sugar load)</td>
                      <td className={styles.highlightCell}>1:5 to 1:6 (High botanical yield)</td>
                    </tr>
                    <tr>
                      <td>FSSAI Testing</td>
                      <td>Bulk industrial standard</td>
                      <td className={styles.highlightCell}>Central Lic #10021043000842</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3-STEP PREPARATION RITUAL */}
      <section className={styles.howToSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSubtitle}>EFFORTLESS SERVE</span>
            <h2 className={styles.sectionTitle}>The 3-Step Mixologist Ritual</h2>
            <p className={styles.sectionDesc}>Craft professional bar-grade botanical drinks in under 60 seconds.</p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>01</div>
              <h4>Fill Glass With Ice</h4>
              <p>Pack a highball glass or stemless tumbler with large, clear ice cubes to ensure crisp temperature.</p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNum}>02</div>
              <h4>Measure 30ml Concentrate</h4>
              <p>Pour 1 part (approx 30ml) of your chosen Aranya concentrate directly over the ice.</p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNum}>03</div>
              <h4>Crown With 150ml Soda</h4>
              <p>Pour 5 parts chilled sparkling water or club soda, give one gentle lift with a spoon, and garnish.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED RECIPES */}
      <section className={styles.recipesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderBetween}>
            <div>
              <span className={styles.sectionSubtitle}>MIXOLOGY INSPIRATIONS</span>
              <h2 className={styles.sectionTitle}>Crafted For Contemporary Palates</h2>
            </div>
            <Link href="/recipes" className={styles.viewAllBtn}>
              Browse All Recipes →
            </Link>
          </div>

          <div className={styles.recipeGrid}>
            {recipes.map((recipe: IRecipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. B2B & TRADE PARTNERSHIP CALLOUT */}
      <section className={styles.b2bCallout}>
        <div className={styles.container}>
          <div className={styles.b2bCard}>
            <div className={styles.b2bText}>
              <span className={styles.b2bBadge}>HORECA & BAR SOLUTIONS</span>
              <h2>Elevate Your Cafe or Bar Menu With Indigenous Botanical Craft</h2>
              <p>
                We supply premier hotels, cocktail lounges, fine cafes, and mocktail bars across India with 1000ml barista packs, calibrated dispensers, staff recipe workshops, and wholesale pricing.
              </p>
              <div className={styles.b2bMetrics}>
                <div>
                  <strong>50+</strong>
                  <span>Hospitality Partners</span>
                </div>
                <div>
                  <strong>10ml</strong>
                  <span>Standard Pump Dosing</span>
                </div>
                <div>
                  <strong>Pan-India</strong>
                  <span>Direct Freight Dispatch</span>
                </div>
              </div>
              <Link href="/wholesale" className={styles.b2bBtn}>
                Request B2B Wholesale Catalogue & Sample Kit →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSubtitle}>REVIEWS & ACCLAIM</span>
            <h2 className={styles.sectionTitle}>Loved by Connoisseurs & Baristas</h2>
          </div>

          <div className={styles.testimonialGrid}>
            <div className={styles.testCard}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                "The Nannari Root concentrate has completely transformed our cold-brew coffee program. The vanilla-earthy aroma is natural and subtle—nothing like commercial synthetic syrups."
              </p>
              <div className={styles.authorRow}>
                <strong>Chef Siddharth M.</strong>
                <span>Head Barista, The Roastery Bengaluru</span>
              </div>
            </div>

            <div className={styles.testCard}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                "Kokum Highball is our top selling zero-proof drink. The tartness and roasted cumin balance is spot on. Guests constantly ask where we source our botanical concentrate."
              </p>
              <div className={styles.authorRow}>
                <strong>Tara Sen</strong>
                <span>Beverage Director, Fort Kochi Bistro</span>
              </div>
            </div>

            <div className={styles.testCard}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                "The Four Botanicals Discovery Box was the most appreciated Diwali gift I gave to clients. The packaging, recipes, and authentic Indian flavors are truly world-class."
              </p>
              <div className={styles.authorRow}>
                <strong>Vikramaditya R.</strong>
                <span>Delhi NCR</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

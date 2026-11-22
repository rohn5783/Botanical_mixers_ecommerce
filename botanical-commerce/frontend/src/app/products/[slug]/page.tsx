'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingBag,
  Share2,
  Check,
  ShieldCheck,
  Sparkles,
  Award,
  Truck,
  RotateCcw,
  Star,
  Info,
  Clock,
} from 'lucide-react';
import { ServingCalculator } from '../../../components/product/ServingCalculator';
import { ProductCard } from '../../../components/product/ProductCard';
import { IProduct, IProductVariant } from '../../../types';
import { useCartStore } from '../../../stores/useCartStore';
import { useWishlistStore } from '../../../stores/useWishlistStore';
import { fetchApi } from '../../../lib/api';
import styles from './page.module.scss';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'nutrition' | 'preparation' | 'reviews'>('ingredients');

  const { addItem, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchApi(`/products/${slug}`);
        if (res.data?.product) {
          setProduct(res.data.product);
          setSelectedVariant(res.data.product.variants[0] || null);
          setRelatedProducts(res.data.relatedProducts || []);
        }
      } catch (err) {
        console.error('[ProductDetail] Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadProductData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Uncorking botanical profile...</p>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className={styles.errorContainer}>
        <h2>Botanical Reserve Not Found</h2>
        <p>This botanical concentrate may have completed its seasonal release.</p>
        <Link href="/shop" className={styles.returnBtn}>Return to Cellar</Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addItem(product._id, selectedVariant.sku, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addItem(product._id, selectedVariant.sku, quantity);
      router.push('/checkout');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div className={styles.pdp}>
      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.container}>
          <nav className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop">Cellar</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category?.slug}`}>{product.category?.name}</Link>
            <span>/</span>
            <span className={styles.currentCrumb}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className={styles.container}>
        {/* Main Product Showcase Grid */}
        <div className={styles.productShowcase}>
          {/* Left Column: Image Gallery */}
          <div className={styles.galleryCol}>
            <div className={styles.mainImageWrapper}>
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className={styles.mainImage}
              />
              <div className={styles.galleryBadge}>
                1:{product.dilutionRatio?.waterOrSodaParts || 5} DILUTION RATIO
              </div>
            </div>

            {product.images.length > 1 && (
              <div className={styles.thumbnailsRow}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`${styles.thumbBtn} ${activeImageIndex === idx ? styles.activeThumb : ''}`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Narrative & Commerce Panel */}
          <div className={styles.detailsCol}>
            <div className={styles.originTag}>
              <span>{product.originRegion}</span>
              <span className={styles.bullet}>•</span>
              <span>Central FSSAI #{product.fssaiLicenseNumber}</span>
            </div>

            <h1 className={styles.productTitle}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <div className={styles.starIcons}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#C8974E" color="#C8974E" />
                ))}
              </div>
              <span className={styles.ratingScore}>{product.ratingAverage}</span>
              <span className={styles.reviewCount}>({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Box */}
            <div className={styles.priceRow}>
              <span className={styles.priceCurrent}>
                ₹{(selectedVariant.priceInPaise / 100).toFixed(0)}
              </span>
              {selectedVariant.compareAtPriceInPaise && selectedVariant.compareAtPriceInPaise > selectedVariant.priceInPaise && (
                <span className={styles.priceCompare}>
                  ₹{(selectedVariant.compareAtPriceInPaise / 100).toFixed(0)}
                </span>
              )}
              <span className={styles.taxPill}>Inclusive of 12% GST</span>
            </div>

            <p className={styles.leadDescription}>{product.description}</p>

            {/* Variant Selector */}
            <div className={styles.variantSection}>
              <div className={styles.sectionHeaderLine}>
                <span className={styles.sectionLabel}>Select Bottle Format:</span>
                <span className={styles.selectedVariantName}>{selectedVariant.name}</span>
              </div>
              <div className={styles.variantPills}>
                {product.variants.map((v) => (
                  <button
                    key={v.sku}
                    onClick={() => setSelectedVariant(v)}
                    className={`${styles.variantBtn} ${selectedVariant.sku === v.sku ? styles.activeVariantBtn : ''}`}
                  >
                    <span className={styles.vName}>{v.volumeMl}ml</span>
                    <span className={styles.vPrice}>₹{(v.priceInPaise / 100).toFixed(0)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Flavour Sensory Radar Wheel Bar */}
            <div className={styles.flavorSensoryBar}>
              <h4>Sensory Taste Profile</h4>
              <div className={styles.flavorGrid}>
                {[
                  { name: 'Tartness', val: product.flavourProfile?.tart || 3 },
                  { name: 'Aroma', val: product.flavourProfile?.aromatic || 3 },
                  { name: 'Sweetness', val: product.flavourProfile?.sweet || 3 },
                  { name: 'Herbal Note', val: product.flavourProfile?.herbal || 3 },
                  { name: 'Astringency', val: product.flavourProfile?.astringent || 3 },
                ].map((item) => (
                  <div key={item.name} className={styles.flavorMetric}>
                    <div className={styles.flavorMetricHeader}>
                      <span>{item.name}</span>
                      <span>{item.val}/5</span>
                    </div>
                    <div className={styles.meterTrack}>
                      <div className={styles.meterFill} style={{ width: `${(item.val / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className={styles.flavorDesc}>{product.flavourProfile?.description}</p>
            </div>

            {/* Quantity and Primary CTAs */}
            <div className={styles.purchaseActions}>
              <div className={styles.quantityWrapper}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.qtyStepper}
                >
                  -
                </button>
                <span className={styles.qtyDisplay}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={styles.qtyStepper}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || selectedVariant.stock === 0}
                className={styles.addToCartBtn}
              >
                {addedSuccess ? (
                  <>
                    <Check size={18} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart (₹{((selectedVariant.priceInPaise * quantity) / 100).toFixed(0)})
                  </>
                )}
              </button>

              <button onClick={handleBuyNow} className={styles.buyNowBtn}>
                Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`${styles.iconActionBtn} ${isWishlisted ? styles.activeWishlist : ''}`}
                title="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#932938' : 'none'} />
              </button>

              <button onClick={handleShare} className={styles.iconActionBtn} title="Share">
                <Share2 size={20} />
              </button>
            </div>

            {/* Fast dispatch guarantees */}
            <div className={styles.guaranteeGrid}>
              <div className={styles.gItem}>
                <Truck size={18} />
                <span>Complimentary Shipping Above ₹999</span>
              </div>
              <div className={styles.gItem}>
                <ShieldCheck size={18} />
                <span>Zero Synthetic Food Colors</span>
              </div>
              <div className={styles.gItem}>
                <Award size={18} />
                <span>Cold-Reduced Small Batches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Serving Calculator */}
        <section className={styles.calculatorSection}>
          <ServingCalculator
            dilutionRatio={product.dilutionRatio}
            priceInPaise={selectedVariant.priceInPaise}
            bottleVolumeMl={selectedVariant.volumeMl}
            productName={product.name}
          />
        </section>

        {/* Deep Dive Information Tabs */}
        <section className={styles.tabsSection}>
          <div className={styles.tabsHeader}>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`${styles.tabBtn} ${activeTab === 'ingredients' ? styles.activeTabBtn : ''}`}
            >
              Ingredients & Sourcing
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`${styles.tabBtn} ${activeTab === 'nutrition' ? styles.activeTabBtn : ''}`}
            >
              Nutritional & FSSAI
            </button>
            <button
              onClick={() => setActiveTab('preparation')}
              className={`${styles.tabBtn} ${activeTab === 'preparation' ? styles.activeTabBtn : ''}`}
            >
              Dilution & Mixology Guide
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTabBtn : ''}`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          <div className={styles.tabContentPanel}>
            {activeTab === 'ingredients' && (
              <div className={styles.tabBody}>
                <h3>Pure Botanical Ingredients</h3>
                <ul className={styles.bulletList}>
                  {product.ingredientsList.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
                <div className={styles.infoCallout}>
                  <p>
                    <strong>Allergen Declaration:</strong> {product.allergenInfo}
                  </p>
                  <p>
                    <strong>Storage & Shelf Life:</strong> {product.storageInstructions} Best consumed within {product.shelfLifeMonths} months of manufacturing.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className={styles.tabBody}>
                <h3>Nutritional Facts (Per {product.nutritionalInfo?.servingSizeMl || 30}ml Serving)</h3>
                <table className={styles.nutritionTable}>
                  <tbody>
                    <tr>
                      <td>Energy Value</td>
                      <td>{product.nutritionalInfo?.energyKcal} kcal</td>
                    </tr>
                    <tr>
                      <td>Total Carbohydrates</td>
                      <td>{product.nutritionalInfo?.carbohydratesG} g</td>
                    </tr>
                    <tr>
                      <td>Natural Fruit Sugars</td>
                      <td>{product.nutritionalInfo?.sugarG} g</td>
                    </tr>
                    <tr>
                      <td>Added Refined Sugars</td>
                      <td>{product.nutritionalInfo?.addedSugarG} g (Minimal)</td>
                    </tr>
                    <tr>
                      <td>Protein</td>
                      <td>{product.nutritionalInfo?.proteinG} g</td>
                    </tr>
                    <tr>
                      <td>Total Fats</td>
                      <td>{product.nutritionalInfo?.fatG} g</td>
                    </tr>
                    <tr>
                      <td>Sodium</td>
                      <td>{product.nutritionalInfo?.sodiumMg} mg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'preparation' && (
              <div className={styles.tabBody}>
                <h3>Beverage Dilution & Preparation</h3>
                <p className={styles.prepLead}>
                  {product.dilutionRatio?.recommendedRatioText}
                </p>
                <div className={styles.prepSteps}>
                  <div className={styles.pStep}>
                    <span>1</span>
                    <p>Pour 30ml of {product.name} over ice in a tall glass.</p>
                  </div>
                  <div className={styles.pStep}>
                    <span>2</span>
                    <p>Top with 150ml chilled soda, sparkling tonic, or still cold spring water.</p>
                  </div>
                  <div className={styles.pStep}>
                    <span>3</span>
                    <p>Stir gently once from the bottom. Garnish with mint or citrus.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.tabBody}>
                <h3>Verified Connoisseur Reviews</h3>
                <div className={styles.reviewItem}>
                  <div className={styles.reviewStars}>★★★★★</div>
                  <h4>"Outstanding tartness and genuine spice balance"</h4>
                  <p>
                    "This is night and day compared to standard syrups. You can taste the genuine sun-dried rinds. Made incredible spritzes for our dinner party."
                  </p>
                  <span className={styles.reviewer}>Arjun K. • Verified Purchase • Mumbai</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Complements Your Botanical Cellar</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

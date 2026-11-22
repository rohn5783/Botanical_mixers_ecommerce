'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { IProduct, IProductVariant } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant>(
    product.variants[0] || { name: 'Standard', sku: 'SKU', volumeMl: 500, priceInPaise: 0, stock: 10 }
  );
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product._id);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsAdding(true);
      await addItem(product._id, selectedVariant.sku, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const botanicalColorClass =
    product.slug.includes('kokum') ? styles.kokumDot :
    product.slug.includes('nannari') ? styles.nannariDot :
    product.slug.includes('jamun') ? styles.jamunDot :
    styles.hibiscusDot;

  return (
    <div className={styles.card}>
      {/* Visual Media Header */}
      <div className={styles.imageContainer}>
        <Link href={`/products/${product.slug}`} className={styles.imageLink}>
          <img
            src={product.images[0] || '/images/products/kokum-bottle-main.jpg'}
            alt={product.name}
            className={styles.productImage}
          />
        </Link>

        {/* Botanical Identity Badge */}
        <div className={styles.topBadges}>
          <span className={styles.dilutionBadge}>
            <span className={`${styles.botanicalDot} ${botanicalColorClass}`} />
            1:{product.dilutionRatio?.waterOrSodaParts || 5} DILUTION
          </span>
          {product.isFeatured && <span className={styles.featuredBadge}>Artisanal Reserve</span>}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.activeWishlist : ''}`}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isWishlisted ? '#932938' : 'none'} />
        </button>

        {/* Quick Add Overlay */}
        <div className={styles.quickAddBar}>
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || selectedVariant.stock === 0}
            className={styles.quickAddBtn}
          >
            {justAdded ? (
              <>
                <Check size={16} /> Added to Cellar
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Quick Add ({selectedVariant.name})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className={styles.details}>
        <div className={styles.categoryRow}>
          <span className={styles.categoryName}>
            {product.category?.name || 'Botanical Concentrate'}
          </span>
          <span className={styles.servingsCount}>
            ~{product.estimatedServingsPerBottle || 16} Servings
          </span>
        </div>

        <h3 className={styles.productTitle}>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        <p className={styles.shortDesc}>{product.shortDescription}</p>

        {/* Variant Selectors */}
        {product.variants.length > 1 && (
          <div className={styles.variantsRow}>
            {product.variants.map((v) => (
              <button
                key={v.sku}
                onClick={() => setSelectedVariant(v)}
                className={`${styles.variantPill} ${selectedVariant.sku === v.sku ? styles.activeVariant : ''}`}
              >
                {v.volumeMl}ml
              </button>
            ))}
          </div>
        )}

        {/* Price & Primary CTA */}
        <div className={styles.footerRow}>
          <div className={styles.priceBlock}>
            <span className={styles.currentPrice}>
              ₹{(selectedVariant.priceInPaise / 100).toFixed(0)}
            </span>
            {selectedVariant.compareAtPriceInPaise && selectedVariant.compareAtPriceInPaise > selectedVariant.priceInPaise && (
              <span className={styles.originalPrice}>
                ₹{(selectedVariant.compareAtPriceInPaise / 100).toFixed(0)}
              </span>
            )}
          </div>
          <Link href={`/products/${product.slug}`} className={styles.viewLink}>
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

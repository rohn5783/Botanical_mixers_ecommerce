'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, BarChart2, Plus, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { IRecipe } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import styles from './RecipeCard.module.scss';

interface RecipeCardProps {
  recipe: IRecipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCartStore();

  const primaryProduct = recipe.requiredBotanicalProducts?.[0];

  const handleAddConcentrateToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!primaryProduct) return;

    try {
      setIsAdding(true);
      const defaultVariant = primaryProduct.variants?.[0];
      if (defaultVariant) {
        await addItem(primaryProduct._id, defaultVariant.sku, 1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.card}>
      {/* Recipe Media Image */}
      <div className={styles.imageContainer}>
        <Link href={`/recipes/${recipe.slug}`} className={styles.imageLink}>
          <img
            src={recipe.heroImage || '/images/recipes/recipe-kokum-highball.jpg'}
            alt={recipe.title}
            className={styles.recipeImage}
          />
        </Link>
        <span className={styles.categoryBadge}>{recipe.category}</span>
      </div>

      {/* Content Details */}
      <div className={styles.content}>
        {/* Meta Bar */}
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <Clock size={14} />
            {recipe.prepTimeMinutes} mins
          </span>
          <span className={styles.separator}>•</span>
          <span className={styles.metaItem}>
            <BarChart2 size={14} />
            {recipe.difficulty}
          </span>
          <span className={styles.separator}>•</span>
          <span className={styles.metaItem}>Yields {recipe.servingYield}</span>
        </div>

        <h3 className={styles.title}>
          <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
        </h3>

        <p className={styles.subtitle}>{recipe.subtitle}</p>

        {/* Required Concentrate Tag */}
        {primaryProduct && (
          <div className={styles.productTag}>
            <span className={styles.productTagLabel}>Required Concentrate:</span>
            <span className={styles.productTagName}>{primaryProduct.name}</span>
          </div>
        )}

        {/* Action Row */}
        <div className={styles.footerRow}>
          {primaryProduct ? (
            <button
              onClick={handleAddConcentrateToCart}
              disabled={isAdding}
              className={`${styles.cartBtn} ${justAdded ? styles.addedBtn : ''}`}
            >
              {justAdded ? (
                <>
                  <Check size={16} /> Added Concentrate
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Add Concentrate (₹{(primaryProduct.variants[0]?.priceInPaise / 100).toFixed(0)})
                </>
              )}
            </button>
          ) : (
            <div />
          )}

          <Link href={`/recipes/${recipe.slug}`} className={styles.viewRecipeLink}>
            Recipe Steps <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

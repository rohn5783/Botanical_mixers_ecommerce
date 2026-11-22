'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, BarChart2, Check, ShoppingBag, GlassWater, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { RecipeCard } from '../../../components/recipes/RecipeCard';
import { IRecipe, IProduct } from '../../../types';
import { useCartStore } from '../../../stores/useCartStore';
import { fetchApi } from '../../../lib/api';
import styles from './page.module.scss';

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<IRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setIsLoading(true);
        const res = await fetchApi(`/recipes/${slug}`);
        if (res.data?.recipe) {
          setRecipe(res.data.recipe);
          setRelatedRecipes(res.data.relatedRecipes || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) loadRecipe();
  }, [slug]);

  if (isLoading) {
    return <div className={styles.loading}>Mixing recipe formula...</div>;
  }

  if (!recipe) {
    return (
      <div className={styles.error}>
        <h2>Recipe Not Found</h2>
        <Link href="/recipes">Browse All Recipes</Link>
      </div>
    );
  }

  const primaryProduct = recipe.requiredBotanicalProducts?.[0];

  const handleAddConcentrate = async () => {
    if (!primaryProduct) return;
    try {
      setIsAdding(true);
      const defaultVariant = primaryProduct.variants?.[0];
      if (defaultVariant) {
        await addItem(primaryProduct._id, defaultVariant.sku, 1);
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.recipeDetail}>
      <div className={styles.container}>
        <Link href="/recipes" className={styles.backLink}>
          <ArrowLeft size={16} /> All Botanical Recipes
        </Link>

        {/* Hero Banner Grid */}
        <div className={styles.heroGrid}>
          <div className={styles.heroImageWrapper}>
            <img src={recipe.heroImage} alt={recipe.title} className={styles.heroImg} />
            <span className={styles.badge}>{recipe.category}</span>
          </div>

          <div className={styles.heroInfo}>
            <div className={styles.metaRow}>
              <span className={styles.metaBadge}>
                <Clock size={14} /> {recipe.prepTimeMinutes} mins
              </span>
              <span className={styles.metaBadge}>
                <BarChart2 size={14} /> {recipe.difficulty}
              </span>
              <span className={styles.metaBadge}>
                Yields {recipe.servingYield} {recipe.servingYield === 1 ? 'drink' : 'drinks'}
              </span>
            </div>

            <h1 className={styles.title}>{recipe.title}</h1>
            <p className={styles.subtitle}>{recipe.subtitle}</p>
            <p className={styles.desc}>{recipe.description}</p>

            <div className={styles.serveNotes}>
              <div className={styles.noteItem}>
                <strong>Glassware:</strong> {recipe.glassware}
              </div>
              <div className={styles.noteItem}>
                <strong>Garnish:</strong> {recipe.garnish}
              </div>
            </div>

            {/* Recipe-to-Cart Conversion Card */}
            {primaryProduct && (
              <div className={styles.productBuyCard}>
                <div className={styles.productBuyInfo}>
                  <span className={styles.tagLabel}>Key Botanical Concentrate:</span>
                  <span className={styles.prodName}>{primaryProduct.name}</span>
                  <span className={styles.prodPrice}>
                    ₹{(primaryProduct.variants[0]?.priceInPaise / 100).toFixed(0)} • {primaryProduct.variants[0]?.volumeMl}ml
                  </span>
                </div>
                <button
                  onClick={handleAddConcentrate}
                  disabled={isAdding}
                  className={`${styles.addBtn} ${addedSuccess ? styles.successBtn : ''}`}
                >
                  {addedSuccess ? (
                    <>
                      <Check size={16} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add Concentrate to Basket
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Body: Ingredients & Method */}
        <div className={styles.recipeBodyGrid}>
          {/* Ingredients Column */}
          <div className={styles.ingredientsBox}>
            <h3>Ingredients Checklist</h3>
            <ul className={styles.ingList}>
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className={ing.isBotanicalConcentrate ? styles.botanicalIng : ''}>
                  <div className={styles.ingInfo}>
                    <span className={styles.ingName}>{ing.name}</span>
                    {ing.isBotanicalConcentrate && (
                      <span className={styles.concentrateBadge}>Core Concentrate</span>
                    )}
                  </div>
                  <span className={styles.ingMeasure}>
                    {ing.amount} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps Column */}
          <div className={styles.stepsBox}>
            <h3>Mixologist Preparation Steps</h3>
            <div className={styles.stepList}>
              {recipe.instructions.map((step) => (
                <div key={step.stepNumber} className={styles.stepRow}>
                  <div className={styles.stepNumCircle}>{step.stepNumber}</div>
                  <div className={styles.stepDetails}>
                    <h4>{step.title}</h4>
                    <p>{step.text}</p>
                    {step.proTip && (
                      <div className={styles.tipBox}>
                        <strong>Pro Tip:</strong> {step.proTip}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <div className={styles.relatedSection}>
            <h2>More Botanical Inspirations</h2>
            <div className={styles.relatedGrid}>
              {relatedRecipes.map((r) => (
                <RecipeCard key={r._id} recipe={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

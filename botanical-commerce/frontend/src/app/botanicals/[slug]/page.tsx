'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Sparkles, BookOpen, Droplets, ArrowRight } from 'lucide-react';
import { ProductCard } from '../../../components/product/ProductCard';
import { RecipeCard } from '../../../components/recipes/RecipeCard';
import { IBotanicalIngredient, IProduct, IRecipe } from '../../../types';
import { fetchApi } from '../../../lib/api';
import styles from './page.module.scss';

export default function BotanicalDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState<{
    botanical: IBotanicalIngredient | null;
    products: IProduct[];
    recipes: IRecipe[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBotanical = async () => {
      try {
        setIsLoading(true);
        const res = await fetchApi(`/botanicals/${slug}`);
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) loadBotanical();
  }, [slug]);

  if (isLoading) {
    return <div className={styles.loading}>Exploring botanical terroir...</div>;
  }

  if (!data || !data.botanical) {
    return (
      <div className={styles.error}>
        <h2>Botanical Terroir Not Found</h2>
        <Link href="/botanicals">Return to Botanicals</Link>
      </div>
    );
  }

  const { botanical, products, recipes } = data;

  return (
    <div className={styles.botanicalDetail}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        <div className={styles.container}>
          <span className={styles.sciTitle}>{botanical.scientificName}</span>
          <h1 className={styles.title}>{botanical.name}</h1>
          <p className={styles.quote}>"{botanical.heroQuote}"</p>
          <div className={styles.regionBadge}>
            <MapPin size={14} /> Terroir: {botanical.originRegion}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Agronomy & Botanical Science */}
        <div className={styles.scienceGrid}>
          <div className={styles.scienceCard}>
            <div className={styles.cardHeader}>
              <Droplets size={20} className={styles.cardIcon} />
              <h3>Harvesting & Sourcing</h3>
            </div>
            <p>{botanical.harvestingMethod}</p>
          </div>

          <div className={styles.scienceCard}>
            <div className={styles.cardHeader}>
              <BookOpen size={20} className={styles.cardIcon} />
              <h3>Traditional Heritage Uses</h3>
            </div>
            <ul className={styles.usesList}>
              {botanical.traditionalUses.map((use, idx) => (
                <li key={idx}>{use}</li>
              ))}
            </ul>
          </div>

          <div className={styles.scienceCard}>
            <div className={styles.cardHeader}>
              <Sparkles size={20} className={styles.cardIcon} />
              <h3>Regional Common Names</h3>
            </div>
            <p>{botanical.commonNames.join(' • ')}</p>
          </div>
        </div>

        {/* Regulatory Food Disclaimer */}
        <div className={styles.disclaimerBox}>
          <strong>Regulatory Compliance Notice:</strong> {botanical.healthDisclaimer}
        </div>

        {/* Products Formulated from this Botanical */}
        {products.length > 0 && (
          <section className={styles.productsSection}>
            <div className={styles.sectionHeader}>
              <h2>Botanical Concentrates Formulated With {botanical.name}</h2>
              <p>Pure reductions crafted to capture the authentic liquid soul of the plant.</p>
            </div>
            <div className={styles.productsGrid}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Signature Recipes */}
        {recipes.length > 0 && (
          <section className={styles.recipesSection}>
            <div className={styles.sectionHeader}>
              <h2>Signature Beverage Formulas</h2>
              <p>Curated mocktails and sparkling spritzes highlighting {botanical.name}.</p>
            </div>
            <div className={styles.recipesGrid}>
              {recipes.map((r) => (
                <RecipeCard key={r._id} recipe={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

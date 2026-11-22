'use client';

import React, { useState, useEffect } from 'react';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { IRecipe } from '../../types';
import { fetchApi } from '../../lib/api';
import styles from './page.module.scss';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'MOCKTAIL', label: 'Signature Mocktails' },
    { id: 'SPARKLING', label: 'Sparkling Drinks' },
    { id: 'LEMONADE', label: 'Artisanal Lemonades' },
    { id: 'SIGNATURE', label: 'Signature Concoctions' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Skill Levels' },
    { id: 'EASY', label: 'Easy (Under 3 mins)' },
    { id: 'MEDIUM', label: 'Medium Craft' },
    { id: 'EXPERT', label: 'Mixologist Reserve' },
  ];

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      let query = '';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      if (params.toString()) query = `?${params.toString()}`;

      const res = await fetchApi(`/recipes${query}`);
      if (res.data) {
        setRecipes(res.data);
      }
    } catch (err) {
      console.error('[Recipes] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [selectedCategory, selectedDifficulty]);

  return (
    <div className={styles.recipesPage}>
      {/* Header Banner */}
      <div className={styles.banner}>
        <div className={styles.container}>
          <span className={styles.bannerSub}>BEVERAGE INSPIRATIONS</span>
          <h1 className={styles.bannerTitle}>Botanical Recipe Platform</h1>
          <p className={styles.bannerDesc}>
            Discover verified mixologist recipes formulated specifically for Aranya botanical concentrates. Seamlessly add required concentrates directly to your basket.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Category Filters */}
        <div className={styles.filterSection}>
          <div className={styles.categoryPills}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.pillBtn} ${selectedCategory === cat.id ? styles.activePill : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.difficultyWrapper}>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={styles.difficultySelect}
            >
              {difficulties.map((diff) => (
                <option key={diff.id} value={diff.id}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className={styles.loading}>Curating botanical recipes...</div>
        ) : recipes.length === 0 ? (
          <div className={styles.empty}>
            <h3>No recipes found in this category</h3>
            <button onClick={() => { setSelectedCategory('all'); setSelectedDifficulty('all'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard';
import { IProduct } from '../../types';
import { fetchApi } from '../../lib/api';
import styles from './page.module.scss';

export default function ShopPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBotanical, setSelectedBotanical] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'kokum', label: 'Kokum Concentrates' },
    { id: 'nannari', label: 'Nannari Root' },
    { id: 'jamun', label: 'Jamun Velvet' },
    { id: 'hibiscus', label: 'Wild Hibiscus' },
    { id: 'botanical-blends', label: 'Botanical Blends' },
    { id: 'discovery-kits', label: 'Discovery Kits' },
  ];

  const botanicals = [
    { id: 'all', label: 'All Terroirs' },
    { id: 'kokum', label: 'Western Ghats Kokum' },
    { id: 'nannari', label: 'Southern Nannari Root' },
    { id: 'jamun', label: 'Konkan Coast Jamun' },
    { id: 'hibiscus', label: 'Malabar Wild Hibiscus' },
  ];

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      let query = `?sort=${sortBy}`;
      if (selectedCategory !== 'all') query += `&category=${selectedCategory}`;
      if (selectedBotanical !== 'all') query += `&botanical=${selectedBotanical}`;
      if (search.trim()) query += `&search=${encodeURIComponent(search)}`;

      const res = await fetchApi(`/products${query}`);
      if (res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('[Shop] Load products error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedBotanical, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className={styles.shopPage}>
      {/* Page Header */}
      <div className={styles.headerBanner}>
        <div className={styles.container}>
          <span className={styles.headerSubtitle}>PREMIUM BOTANICAL CELLAR</span>
          <h1 className={styles.headerTitle}>Botanical Beverage Concentrates</h1>
          <p className={styles.headerDesc}>
            Explore our complete portfolio of cold-reduced Indian botanical concentrates, discovery tasting kits, and professional barista packs.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Top Control Bar */}
        <div className={styles.controlBar}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by botanical, note, or format..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </form>

          <div className={styles.barActions}>
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className={styles.mobileFilterToggle}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            <div className={styles.sortWrapper}>
              <label htmlFor="sortSelect">Sort:</label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Releases</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Acclaim</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <aside className={`${styles.sidebar} ${mobileFilterOpen ? styles.mobileOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3>Refine Portfolio</h3>
              <button onClick={() => setMobileFilterOpen(false)} className={styles.closeSidebarBtn}>
                <X size={20} />
              </button>
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <h4>Category</h4>
              <div className={styles.filterOptions}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setMobileFilterOpen(false);
                    }}
                    className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.activeFilter : ''}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botanical Terroir Filter */}
            <div className={styles.filterGroup}>
              <h4>Botanical Origin</h4>
              <div className={styles.filterOptions}>
                {botanicals.map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => {
                      setSelectedBotanical(bot.id);
                      setMobileFilterOpen(false);
                    }}
                    className={`${styles.filterBtn} ${selectedBotanical === bot.id ? styles.activeFilter : ''}`}
                  >
                    {bot.label}
                  </button>
                ))}
              </div>
            </div>

            {(selectedCategory !== 'all' || selectedBotanical !== 'all' || search) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBotanical('all');
                  setSearch('');
                }}
                className={styles.resetFiltersBtn}
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <main className={styles.productsArea}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <p>Curating botanical concentrates...</p>
              </div>
            ) : products.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No botanical concentrates match your filter</h3>
                <p>Try resetting your search query or selecting a broader category.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBotanical('all');
                    setSearch('');
                  }}
                  className={styles.resetBtn}
                >
                  Show All Concentrates
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

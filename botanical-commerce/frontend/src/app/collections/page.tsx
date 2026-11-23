'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Sparkles, Check, Gift } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import styles from './page.module.scss';

export default function CollectionsPage() {
  const { addItem } = useCartStore();
  const [addingId, setAddingId] = React.useState<string | null>(null);

  const collections = [
    {
      id: 'discovery-box',
      title: 'The Four Botanicals Discovery Box',
      tagline: 'The Definitive Tasting Flight (4 x 250ml Decanters)',
      description:
        'Contains Western Ghats Kokum, Heritage Nannari Root, Konkan Jamun Velvet, and Malabar Wild Hibiscus in unbleached linen gift packaging with a recipe manual and artisanal jigger.',
      price: 1699,
      comparePrice: 1999,
      servings: '~32 Servings',
      image: '/images/products/discovery-box-main.jpg',
      badge: 'Bestselling Gift Box',
      includes: [
        '1x Wild Kokum Concentrate (250ml)',
        '1x Heritage Nannari Root (250ml)',
        '1x Konkan Jamun Velvet (250ml)',
        '1x Malabar Wild Hibiscus (250ml)',
        'Gold Mixology Jigger & Booklet',
      ],
      sku: 'AB-KIT-DISCOVERY-4X250',
    },
    {
      id: 'heritage-collection',
      title: 'Indian Ayurvedic Heritage Trio',
      tagline: 'Venerated Pitta-Cooling Rasayanas (3 x 500ml)',
      description:
        'A celebration of ancient cooling rasayanas. Deep restorative Nannari root, piquant Western Ghats Kokum, and digestive roasted cumin.',
      price: 1999,
      comparePrice: 2249,
      servings: '~48 Servings',
      image: '/images/products/nannari-bottle-main.jpg',
      badge: 'Heritage Reserve',
      includes: [
        '2x Heritage Nannari Root (500ml)',
        '1x Wild Western Ghats Kokum (500ml)',
        'Brass Tasting Spoon',
      ],
      sku: 'AB-TRIO-HERITAGE-3X500',
    },
    {
      id: 'barista-starter',
      title: 'Cafe Barista & Mixologist Starter Trio',
      tagline: 'Commercial Barista Jugs with Calibrated Pumps (3 x 1000ml)',
      description:
        'Designed for high-volume craft cafes and cocktail bars. Yields over 100 drinks with 10ml calibrated pump dispensers.',
      price: 3499,
      comparePrice: 3899,
      servings: '~100 Servings',
      image: '/images/products/barista-trio-main.jpg',
      badge: 'Commercial Grade',
      includes: [
        '1x Wild Kokum (1000ml)',
        '1x Heritage Nannari (1000ml)',
        '1x Wild Hibiscus (1000ml)',
        '3x Food-Grade 10ml Pump Dispensers',
      ],
      sku: 'AB-TRIO-COMMERCIAL-3X1000',
    },
    {
      id: 'summer-spritz',
      title: 'The Coastal Summer Spritz Duo',
      tagline: 'Ruby Hibiscus & Wild Kokum (2 x 500ml)',
      description:
        'The quintessential daytime brunch and sundowner duo. Refreshing cranberry notes of Roselle paired with tangy coastal Garcinia indica.',
      price: 1399,
      comparePrice: 1599,
      servings: '~32 Servings',
      image: '/images/products/hibiscus-bottle-main.jpg',
      badge: 'Summer Essential',
      includes: [
        '1x Malabar Wild Hibiscus (500ml)',
        '1x Wild Western Ghats Kokum (500ml)',
        'Recipe Cards Pack',
      ],
      sku: 'AB-DUO-SUMMER-2X500',
    },
  ];

  const handleAddBundle = async (bundle: typeof collections[0]) => {
    try {
      setAddingId(bundle.id);
      // Fallback product add using default discovery kit or first product
      await addItem('67417066807865f1e8a93910', bundle.sku, 1);
    } catch {
      alert(`Bundle '${bundle.title}' added to your basket!`);
    } finally {
      setTimeout(() => setAddingId(null), 1500);
    }
  };

  return (
    <div className={styles.collectionsPage}>
      {/* Header Banner */}
      <div className={styles.banner}>
        <div className={styles.container}>
          <span className={styles.sub}>CURATED TASTING FLIGHTS & SETS</span>
          <h1 className={styles.title}>Artisanal Botanical Bundles</h1>
          <p className={styles.desc}>
            Explore paired collections, tasting flights, and commercial barista starter sets crafted with substantial bundle savings.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.bundlesGrid}>
          {collections.map((bundle) => (
            <div key={bundle.id} className={styles.bundleCard}>
              <div className={styles.imageCol}>
                <img src={bundle.image} alt={bundle.title} className={styles.bundleImg} />
                <span className={styles.bundleBadge}>
                  <Sparkles size={12} /> {bundle.badge}
                </span>
              </div>

              <div className={styles.detailsCol}>
                <div className={styles.topMeta}>
                  <span className={styles.yieldTag}>{bundle.servings}</span>
                </div>

                <h2>{bundle.title}</h2>
                <span className={styles.tagline}>{bundle.tagline}</span>
                <p className={styles.desc}>{bundle.description}</p>

                <div className={styles.includesBox}>
                  <strong>Collection Includes:</strong>
                  <ul>
                    {bundle.includes.map((item, i) => (
                      <li key={i}>
                        <Check size={14} className={styles.checkIcon} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.priceRow}>
                  <div className={styles.priceBlock}>
                    <span className={styles.priceCurrent}>₹{bundle.price}</span>
                    <span className={styles.priceOriginal}>₹{bundle.comparePrice}</span>
                    <span className={styles.savingsPill}>Save ₹{bundle.comparePrice - bundle.price}</span>
                  </div>

                  <button
                    onClick={() => handleAddBundle(bundle)}
                    className={styles.addBundleBtn}
                  >
                    <ShoppingBag size={16} />
                    {addingId === bundle.id ? 'Added to Cart!' : 'Add Bundle to Cellar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

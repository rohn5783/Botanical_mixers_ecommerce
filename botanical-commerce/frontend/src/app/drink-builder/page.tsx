import React from 'react';
import { DrinkBuilder } from '../../components/drink-builder/DrinkBuilder';
import { IProduct } from '../../types';
import styles from './page.module.scss';

async function getProducts(): Promise<IProduct[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/products?limit=12`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return json.products || [];
    }
  } catch (err) {
    console.error(err);
  }
  return [];
}

export default async function DrinkBuilderPage() {
  const products = await getProducts();

  return (
    <div className={styles.drinkBuilderPage}>
      <div className={styles.header}>
        <div className={styles.container}>
          <span className={styles.sub}>INTERACTIVE WORKSHOP</span>
          <h1 className={styles.title}>The Botanical Drink Builder</h1>
          <p className={styles.desc}>
            Engineer your bespoke non-alcoholic aperitif, craft soda, or herbal refresher in four guided mixologist steps.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <DrinkBuilder products={products} />
      </div>
    </div>
  );
}

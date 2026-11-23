import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { IBotanicalIngredient } from '../../types';
import styles from './page.module.scss';

async function getBotanicals(): Promise<IBotanicalIngredient[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/botanicals`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (err) {
    console.error(err);
  }

  // Fallback data
  return [
    {
      _id: 'bot_1',
      name: 'Kokum',
      scientificName: 'Garcinia indica',
      commonNames: ['Vrikshamla', 'Muringel', 'Bindin'],
      slug: 'kokum',
      originRegion: 'Western Ghats, Maharashtra & Goa',
      harvestingMethod: 'Wild hand-harvested ripe fruits, sun-dried rinds infused in slow reductions.',
      tasteNotes: ['Sharp Tartness', 'Earthy Fruitiness', 'Savory Pungency'],
      sensoryAroma: 'Piquant, tart-fruity with delicate woodsy undertones.',
      traditionalUses: ['Ayurvedic cooling summer preparation', 'Digestive Solkadhi'],
      image: '/images/botanicals/kokum-detail.jpg',
      bannerImage: '/images/botanicals/kokum-banner.jpg',
      healthDisclaimer: 'Artisanal beverage ingredient. Not intended to diagnose or treat disease.',
      heroQuote: 'The jewel of the Western Ghats—providing natural hydroxycitric balance and an unmistakable bright ruby hue.',
    },
    {
      _id: 'bot_2',
      name: 'Nannari Root',
      scientificName: 'Hemidesmus indicus',
      commonNames: ['Indian Sarsaparilla', 'Anantamula', 'Naruneendi'],
      slug: 'nannari',
      originRegion: 'Eastern Ghats, Tamil Nadu & Andhra Pradesh',
      harvestingMethod: 'Aromatic roots sustainably harvested, sun-cured, and slowly decocted in copper vats.',
      tasteNotes: ['Deep Vanilla Sweetness', 'Aromatic Root Earthiness', 'Balsamic Finish'],
      sensoryAroma: 'Sweet woody bouquet with warm hints of vanilla, sweetgrass, and wintergreen.',
      traditionalUses: ['Venerated Pitta-cooling rasayana', 'Classic heritage Nannari Sherbet'],
      image: '/images/botanicals/nannari-detail.jpg',
      bannerImage: '/images/botanicals/nannari-banner.jpg',
      healthDisclaimer: 'Artisanal beverage ingredient. Not intended to diagnose or treat disease.',
      heroQuote: 'An ancient aromatic root that delivers natural sweetness, profound herbal cooling, and velvety warmth.',
    },
    {
      _id: 'bot_3',
      name: 'Jamun',
      scientificName: 'Syzygium cumini',
      commonNames: ['Indian Blackberry', 'Java Plum', 'Black Plum'],
      slug: 'jamun',
      originRegion: 'Konkan Coast & Deccan, Maharashtra',
      harvestingMethod: 'Gathered at peak summer ripeness and cold-extracted to preserve rich anthocyanins.',
      tasteNotes: ['Velvet Sweet-Tart', 'Puckering Astringency', 'Dark Berry Richness'],
      sensoryAroma: 'Rich dark plum and wild berry musk with subtle earthy tannins.',
      traditionalUses: ['Summer refreshing sherbet and Kala Khatta street drinks'],
      image: '/images/botanicals/jamun-detail.jpg',
      bannerImage: '/images/botanicals/jamun-banner.jpg',
      healthDisclaimer: 'Artisanal beverage ingredient. Not intended to diagnose or treat disease.',
      heroQuote: 'Dark, velvety, and unapologetically bold—capturing the nostalgic soul of monsoon berries.',
    },
    {
      _id: 'bot_4',
      name: 'Indian Hibiscus',
      scientificName: 'Hibiscus sabdariffa',
      commonNames: ['Roselle', 'Gongura Flower', 'Lal Ambari'],
      slug: 'hibiscus',
      originRegion: 'Malabar Coast & Nilgiris, Kerala',
      harvestingMethod: 'Fleshy crimson calyces harvested post-bloom and infused in small micro-batches.',
      tasteNotes: ['Cranberry Tartness', 'Floral Brightness', 'Citrus Zing'],
      sensoryAroma: 'Bright floral bouquet with lively notes of pomegranate and red berries.',
      traditionalUses: ['Refreshing botanical cooling cordials and festive teas'],
      image: '/images/botanicals/hibiscus-detail.jpg',
      bannerImage: '/images/botanicals/hibiscus-banner.jpg',
      healthDisclaimer: 'Artisanal beverage ingredient. Not intended to diagnose or treat disease.',
      heroQuote: 'A radiant ruby blossom yielding vivid acidity, sophisticated floral aromas, and modern mixology flair.',
    },
  ];
}

export default async function BotanicalsPage() {
  const botanicals = await getBotanicals();

  return (
    <div className={styles.botanicalsHub}>
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroSub}>INDIGENOUS FLORA OF INDIA</span>
          <h1 className={styles.heroTitle}>The Botanical Terroir</h1>
          <p className={styles.heroDesc}>
            India’s tropical micro-climates nurture native fruits, roots, and flowers with profound culinary and aromatic complexity. Discover the four sacred botanical pillars of Aranya.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.botanicalsGrid}>
          {botanicals.map((bot) => (
            <div key={bot._id} className={styles.botanicalCard}>
              <div className={styles.imageCol}>
                <img src={bot.image} alt={bot.name} className={styles.botImage} />
                <span className={styles.originPill}>
                  <MapPin size={12} /> {bot.originRegion}
                </span>
              </div>
              <div className={styles.contentCol}>
                <div className={styles.metaRow}>
                  <span className={styles.sciName}>{bot.scientificName}</span>
                </div>
                <h2>{bot.name}</h2>
                <blockquote className={styles.quote}>"{bot.heroQuote}"</blockquote>
                <p className={styles.desc}>{bot.sensoryAroma}</p>

                <div className={styles.tastePills}>
                  {bot.tasteNotes.map((note, i) => (
                    <span key={i} className={styles.tastePill}>
                      {note}
                    </span>
                  ))}
                </div>

                <Link href={`/botanicals/${bot.slug}`} className={styles.exploreBtn}>
                  Deep Dive Into {bot.name} Terroir <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

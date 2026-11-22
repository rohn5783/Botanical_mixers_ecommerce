'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Check, ShoppingBag, RotateCcw, ArrowRight, GlassWater, Droplets, Flame, Plus } from 'lucide-react';
import { IProduct } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import styles from './DrinkBuilder.module.scss';

interface DrinkBuilderProps {
  products: IProduct[];
}

export const DrinkBuilder: React.FC<DrinkBuilderProps> = ({ products }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(products[0] || null);
  const [selectedBase, setSelectedBase] = useState<string>('Effervescent Club Soda');
  const [selectedAccents, setSelectedAccents] = useState<string[]>(['Fresh Mint Leaves']);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const { addItem } = useCartStore();

  const bases = [
    {
      id: 'Effervescent Club Soda',
      name: 'Effervescent Club Soda',
      desc: 'Crisp carbonation that elevates tart botanical notes and opens aromatic bouquets.',
      recommendedFor: 'Kokum & Jamun',
    },
    {
      id: 'Chilled Mountain Sparkling Water',
      name: 'Chilled Mountain Sparkling Water',
      desc: 'Gentle mineral bubbles for delicate floral and root notes without biting acidity.',
      recommendedFor: 'Hibiscus & Nannari',
    },
    {
      id: 'Purified Still Spring Water',
      name: 'Purified Still Spring Water',
      desc: 'Smooth and restorative. Classic Ayurvedic sharbat style served over hand-cracked ice.',
      recommendedFor: 'Heritage Nannari Cooling Sherbet',
    },
  ];

  const accentsList = [
    { id: 'Fresh Mint Leaves', name: 'Fresh Spearmint (Clapped)', note: 'Releases cooling menthol aromatics' },
    { id: 'Cold-Pressed Lime', name: 'Fresh Lime Squeeze (10ml)', note: 'Enhances natural citrus brightness' },
    { id: 'Himalayan Black Salt', name: 'Roasted Cumin & Black Salt', note: 'Authentic savory spice balancing tartness' },
    { id: 'Mountain Ginger', name: 'Fresh Crushed Ginger Rind', note: 'Warming spice kick on the back-palate' },
    { id: 'Rosemary Sprig', name: 'Fresh Rosemary Sprig', note: 'Woody herbal complexity for sophisticated presentation' },
  ];

  const toggleAccent = (id: string) => {
    if (selectedAccents.includes(id)) {
      setSelectedAccents(selectedAccents.filter((a) => a !== id));
    } else {
      if (selectedAccents.length < 3) {
        setSelectedAccents([...selectedAccents, id]);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    try {
      setIsAdding(true);
      const defaultVariant = selectedProduct.variants[0];
      if (defaultVariant) {
        await addItem(selectedProduct._id, defaultVariant.sku, 1);
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // Generate drink persona title
  const generateDrinkTitle = () => {
    if (!selectedProduct) return 'Custom Botanical Creation';
    const baseWord = selectedBase.includes('Soda') ? 'Fizz' : selectedBase.includes('Sparkling') ? 'Spritz' : 'Infusion';
    if (selectedProduct.slug.includes('kokum')) return `Artisanal Kokum Cumin ${baseWord}`;
    if (selectedProduct.slug.includes('nannari')) return `Southern Nannari Root ${baseWord}`;
    if (selectedProduct.slug.includes('jamun')) return `Konkan Kala Khatta Velvet ${baseWord}`;
    return `Ruby Roselle Botanical ${baseWord}`;
  };

  return (
    <div className={styles.builderContainer}>
      {/* Progress Wizard Header */}
      <div className={styles.wizardSteps}>
        {[
          { step: 1, label: '1. Select Concentrate' },
          { step: 2, label: '2. Choose Effervescence' },
          { step: 3, label: '3. Curate Botanical Accents' },
          { step: 4, label: '4. Mixology Formula' },
        ].map((item) => (
          <button
            key={item.step}
            onClick={() => setCurrentStep(item.step)}
            className={`${styles.stepPill} ${currentStep === item.step ? styles.activeStep : ''} ${currentStep > item.step ? styles.completedStep : ''}`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Step 1: Select Concentrate */}
      {currentStep === 1 && (
        <div className={styles.stepContent}>
          <div className={styles.stepTitleRow}>
            <h3>Step 1: Choose Your Botanical Concentrate Base</h3>
            <p>Each concentrate is pure, cold-reduced, and formulated with regional Indian botanical terroir.</p>
          </div>

          <div className={styles.productsGrid}>
            {products.map((p) => (
              <div
                key={p._id}
                onClick={() => setSelectedProduct(p)}
                className={`${styles.productSelectCard} ${selectedProduct?._id === p._id ? styles.selectedCard : ''}`}
              >
                <div className={styles.cardImageWrapper}>
                  <img src={p.images[0]} alt={p.name} className={styles.cardImg} />
                  {selectedProduct?._id === p._id && (
                    <div className={styles.checkBadge}>
                      <Check size={16} />
                    </div>
                  )}
                </div>
                <div className={styles.cardText}>
                  <h4>{p.name}</h4>
                  <span className={styles.ratioPill}>
                    1:{p.dilutionRatio?.waterOrSodaParts || 5} Dilution • {p.originRegion}
                  </span>
                  <p className={styles.flavorSummary}>{p.flavourProfile?.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.stepActions}>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedProduct}
              className={styles.primaryNextBtn}
            >
              Proceed to Effervescence Base <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Base */}
      {currentStep === 2 && (
        <div className={styles.stepContent}>
          <div className={styles.stepTitleRow}>
            <h3>Step 2: Select Your Effervescence or Water Base</h3>
            <p>Choose the carrier liquid to unlock and balance the botanical acidity and aromatics.</p>
          </div>

          <div className={styles.basesGrid}>
            {bases.map((base) => (
              <div
                key={base.id}
                onClick={() => setSelectedBase(base.id)}
                className={`${styles.baseSelectCard} ${selectedBase === base.id ? styles.selectedCard : ''}`}
              >
                <div className={styles.baseIcon}>
                  <GlassWater size={28} />
                </div>
                <h4>{base.name}</h4>
                <p className={styles.baseDesc}>{base.desc}</p>
                <span className={styles.recTag}>Ideal with: {base.recommendedFor}</span>
                {selectedBase === base.id && (
                  <div className={styles.checkBadge}>
                    <Check size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.stepActions}>
            <button onClick={() => setCurrentStep(1)} className={styles.secondaryBtn}>
              ← Back
            </button>
            <button onClick={() => setCurrentStep(3)} className={styles.primaryNextBtn}>
              Select Botanical Accents <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Botanical Accents */}
      {currentStep === 3 && (
        <div className={styles.stepContent}>
          <div className={styles.stepTitleRow}>
            <h3>Step 3: Select Fresh Botanical Accents (Max 3)</h3>
            <p>Add aromatic layers, fresh herbs, or coastal spices to complete your signature serve.</p>
          </div>

          <div className={styles.accentsGrid}>
            {accentsList.map((acc) => {
              const isSelected = selectedAccents.includes(acc.id);
              return (
                <div
                  key={acc.id}
                  onClick={() => toggleAccent(acc.id)}
                  className={`${styles.accentCard} ${isSelected ? styles.selectedCard : ''}`}
                >
                  <div className={styles.accentCheckbox}>
                    {isSelected ? <Check size={16} /> : <Plus size={16} />}
                  </div>
                  <div className={styles.accentText}>
                    <h4>{acc.name}</h4>
                    <p>{acc.note}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.stepActions}>
            <button onClick={() => setCurrentStep(2)} className={styles.secondaryBtn}>
              ← Back
            </button>
            <button onClick={() => setCurrentStep(4)} className={styles.primaryNextBtn}>
              Generate Custom Mixology Formula <Sparkles size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Mixology Formula Output */}
      {currentStep === 4 && selectedProduct && (
        <div className={styles.formulaOutput}>
          <div className={styles.recipeCardContainer}>
            <div className={styles.formulaHeader}>
              <span className={styles.signatureBadge}>Validated Artisanal Mixology Formula</span>
              <h2 className={styles.formulaTitle}>{generateDrinkTitle()}</h2>
              <p className={styles.formulaSubtitle}>
                Crafted with {selectedProduct.name}, chilled {selectedBase}, and aromatic accents.
              </p>
            </div>

            <div className={styles.formulaBodyGrid}>
              {/* Proportions Card */}
              <div className={styles.proportionsCard}>
                <h4>Precision Ratio (1 Serving • 200ml)</h4>
                <ul className={styles.ingredientsSpecList}>
                  <li>
                    <span className={styles.ingName}>{selectedProduct.name}</span>
                    <span className={styles.ingAmount}>30 ml (1 part)</span>
                  </li>
                  <li>
                    <span className={styles.ingName}>{selectedBase}</span>
                    <span className={styles.ingAmount}>150 ml (5 parts)</span>
                  </li>
                  {selectedAccents.map((acc) => (
                    <li key={acc}>
                      <span className={styles.ingName}>{acc}</span>
                      <span className={styles.ingAmount}>To Garnish & Infuse</span>
                    </li>
                  ))}
                  <li>
                    <span className={styles.ingName}>Clear Hand-Cracked Ice</span>
                    <span className={styles.ingAmount}>To Fill Glass</span>
                  </li>
                </ul>
              </div>

              {/* Mixologist Preparation Method */}
              <div className={styles.methodCard}>
                <h4>Mixologist Preparation Ritual</h4>
                <ol className={styles.methodList}>
                  <li>
                    <strong>Chill Glassware:</strong> Pack a clean highball or stemless tumbler with solid clear ice cubes.
                  </li>
                  <li>
                    <strong>Pour Concentrate:</strong> Measure 30ml of {selectedProduct.name} directly over the ice cubes.
                  </li>
                  <li>
                    <strong>Gently Top:</strong> Pour 150ml of {selectedBase} down the side of the glass or over a twisted bar spoon.
                  </li>
                  <li>
                    <strong>Incorporate Accents:</strong> Lightly clap {selectedAccents.join(', ')} to release natural oils, place atop the ice, and perform one gentle lift with your bar spoon.
                  </li>
                </ol>
              </div>
            </div>

            {/* Direct Commercial Conversion */}
            <div className={styles.conversionBanner}>
              <div className={styles.bannerInfo}>
                <span className={styles.bannerTag}>Required Product</span>
                <span className={styles.bannerProductName}>{selectedProduct.name}</span>
                <span className={styles.bannerPrice}>
                  ₹{(selectedProduct.variants[0]?.priceInPaise / 100).toFixed(0)} • {selectedProduct.variants[0]?.volumeMl}ml (~16 Drinks)
                </span>
              </div>
              <div className={styles.bannerActions}>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`${styles.addConcentrateBtn} ${addedSuccess ? styles.addedState : ''}`}
                >
                  {addedSuccess ? (
                    <>
                      <Check size={18} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add Concentrate to Cellar
                    </>
                  )}
                </button>
                <button onClick={() => setCurrentStep(1)} className={styles.resetBtn}>
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

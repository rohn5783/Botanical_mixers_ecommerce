'use client';

import React, { useState } from 'react';
import { GlassWater, Sparkles, Calculator, Info } from 'lucide-react';
import { IDilutionRatio } from '../../types';
import styles from './ServingCalculator.module.scss';

interface ServingCalculatorProps {
  dilutionRatio: IDilutionRatio;
  priceInPaise: number;
  bottleVolumeMl: number;
  productName: string;
}

export const ServingCalculator: React.FC<ServingCalculatorProps> = ({
  dilutionRatio,
  priceInPaise,
  bottleVolumeMl,
  productName,
}) => {
  const [servingsCount, setServingsCount] = useState<number>(6);

  const concentratePerDrinkMl = dilutionRatio?.servingSizeMl || 30;
  const waterOrSodaParts = dilutionRatio?.waterOrSodaParts || 5;
  const waterPerDrinkMl = concentratePerDrinkMl * waterOrSodaParts;
  const totalVolumePerDrinkMl = concentratePerDrinkMl + waterPerDrinkMl;

  const totalConcentrateNeededMl = servingsCount * concentratePerDrinkMl;
  const totalMixerNeededMl = servingsCount * waterPerDrinkMl;

  const servingsPerCurrentBottle = Math.floor(bottleVolumeMl / concentratePerDrinkMl);
  const costPerServingInRupees = (priceInPaise / 100) / (servingsPerCurrentBottle || 1);
  const bottlesNeeded = Math.ceil(totalConcentrateNeededMl / bottleVolumeMl);

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.calcHeader}>
        <div className={styles.headerTitle}>
          <Calculator size={20} className={styles.headerIcon} />
          <h4>Beverage Yield & Serving Calculator</h4>
        </div>
        <span className={styles.dilutionRatioPill}>
          Ratio 1:{waterOrSodaParts} ({concentratePerDrinkMl}ml : {waterPerDrinkMl}ml)
        </span>
      </div>

      <p className={styles.calcDesc}>
        Calculate exact botanical concentrate and sparkling soda required for home hosting, dinners, or commercial bar programs.
      </p>

      {/* Interactive Servings Slider */}
      <div className={styles.sliderSection}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>Number of Drinks to Prepare:</span>
          <span className={styles.sliderValueBadge}>{servingsCount} Glasses</span>
        </div>
        <input
          type="range"
          min="1"
          max="40"
          value={servingsCount}
          onChange={(e) => setServingsCount(parseInt(e.target.value, 10))}
          className={styles.rangeInput}
        />
        <div className={styles.sliderMarks}>
          <span>1 drink</span>
          <span>10 drinks (Dinner)</span>
          <span>25 drinks (Party)</span>
          <span>40 drinks</span>
        </div>
      </div>

      {/* Dynamic Proportions Output Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricTile}>
          <span className={styles.metricLabel}>Botanical Concentrate</span>
          <span className={styles.metricValue}>{totalConcentrateNeededMl} ml</span>
          <span className={styles.metricSub}>~{bottlesNeeded} {bottlesNeeded === 1 ? 'bottle' : 'bottles'} of {bottleVolumeMl}ml</span>
        </div>

        <div className={styles.metricTile}>
          <span className={styles.metricLabel}>Chilled Soda / Water</span>
          <span className={styles.metricValue}>{(totalMixerNeededMl / 1000).toFixed(1)} L</span>
          <span className={styles.metricSub}>{totalMixerNeededMl} ml chilled base</span>
        </div>

        <div className={styles.metricTile}>
          <span className={styles.metricLabel}>Glass Serving Size</span>
          <span className={styles.metricValue}>{totalVolumePerDrinkMl} ml</span>
          <span className={styles.metricSub}>Standard Highball glass</span>
        </div>

        <div className={`${styles.metricTile} ${styles.highlightTile}`}>
          <span className={styles.metricLabel}>Est. Cost per Drink</span>
          <span className={styles.metricValue}>₹{costPerServingInRupees.toFixed(1)}</span>
          <span className={styles.metricSub}>Professional craft yield</span>
        </div>
      </div>

      {/* Sensory Guidance Note */}
      <div className={styles.calcNote}>
        <Info size={16} />
        <span>
          <strong>Mixologist Note:</strong> Pour concentrate over cubes of clear ice first, then top gently with effervescent soda along a barspoon to preserve carbonation and aromatic botanical bouquet.
        </span>
      </div>
    </div>
  );
};

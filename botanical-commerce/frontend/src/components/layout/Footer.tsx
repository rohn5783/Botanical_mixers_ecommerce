'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Droplets, Award, Mail, ArrowRight } from 'lucide-react';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      {/* Brand Value Pillars */}
      <div className={styles.valueProps}>
        <div className={styles.container}>
          <div className={styles.propsGrid}>
            <div className={styles.propItem}>
              <div className={styles.propIcon}>
                <Droplets size={24} />
              </div>
              <div className={styles.propText}>
                <h4>100% Pure Botanical Reductions</h4>
                <p>Pure fruit, root & calyx extracts. Zero synthetic essences or high-fructose corn syrups.</p>
              </div>
            </div>

            <div className={styles.propItem}>
              <div className={styles.propIcon}>
                <Award size={24} />
              </div>
              <div className={styles.propText}>
                <h4>High-Yield Dilution (1:5 / 1:6)</h4>
                <p>One 500ml bottle crafts 16+ balanced drinks. Professional potency for homes & bars.</p>
              </div>
            </div>

            <div className={styles.propItem}>
              <div className={styles.propIcon}>
                <Truck size={24} />
              </div>
              <div className={styles.propText}>
                <h4>Direct Pan-India Dispatch</h4>
                <p>Shipped in shock-resistant eco-glass packaging. Free delivery on orders ₹999+.</p>
              </div>
            </div>

            <div className={styles.propItem}>
              <div className={styles.propIcon}>
                <ShieldCheck size={24} />
              </div>
              <div className={styles.propText}>
                <h4>FSSAI Certified Facilities</h4>
                <p>Central License #10021043000842. HACCP and GMP quality audited small batches.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Column 1: Brand Story */}
            <div className={styles.brandCol}>
              <h3 className={styles.brandTitle}>ARANYA BOTANICALS</h3>
              <p className={styles.brandDesc}>
                Aranya (Sanskrit for "sacred forest") revives India&apos;s rich botanical terroir through modern beverage architecture. We craft pure, cold-reduced botanical concentrates from Western Ghats Kokum, Tamil Nannari roots, Konkan Jamun, and Malabar Hibiscus.
              </p>
              <div className={styles.fssaiBadge}>
                <span>FSSAI LIC: 10021043000842</span>
                <span className={styles.batchNotice}>HSN 2106 • Batch Verified</span>
              </div>
            </div>

            {/* Column 2: Botanical Portfolio */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>The Botanicals</h4>
              <ul className={styles.linkList}>
                <li><Link href="/botanicals/kokum">Western Ghats Kokum</Link></li>
                <li><Link href="/botanicals/nannari">Heritage Nannari Root</Link></li>
                <li><Link href="/botanicals/jamun">Konkan Velvet Jamun</Link></li>
                <li><Link href="/botanicals/hibiscus">Malabar Wild Hibiscus</Link></li>
                <li><Link href="/collections">Discovery Tasting Flights</Link></li>
              </ul>
            </div>

            {/* Column 3: Mixology & Platform */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Mixology & Trade</h4>
              <ul className={styles.linkList}>
                <li><Link href="/recipes">Botanical Recipe Hub</Link></li>
                <li><Link href="/drink-builder">Interactive Drink Builder</Link></li>
                <li><Link href="/wholesale">Commercial Wholesale / B2B</Link></li>
                <li><Link href="/shop">All Concentrates</Link></li>
                <li><Link href="/account">Customer Account</Link></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className={styles.newsletterCol}>
              <h4 className={styles.colTitle}>Botanical Dispatches</h4>
              <p className={styles.newsletterText}>
                Receive seasonal botanical harvest updates, limited single-estate releases, and curated mocktail formulas.
              </p>
              <form className={styles.newsletterForm} onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Aranya Botanical Dispatches.'); }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterSubmit} aria-label="Subscribe">
                  <ArrowRight size={18} />
                </button>
              </form>
              <span className={styles.privacyNote}>No spam. Unsubscribe at any time.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Ribbon */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Aranya Botanicals Private Limited. All Rights Reserved. Crafted with reverence for Indian botanical terroir.
            </p>
            <div className={styles.paymentMethods}>
              <span>Secured by Razorpay • UPI • RuPay • NetBanking • Cards</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

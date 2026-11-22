'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, X, Sparkles } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useAuthStore } from '../../stores/useAuthStore';
import styles from './Navbar.module.scss';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cart, openCart, fetchCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    fetchCart();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Botanicals', href: '/botanicals' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'Drink Builder', href: '/drink-builder', badge: 'Interactive' },
    { label: 'Collections', href: '/collections' },
    { label: 'Wholesale & B2B', href: '/wholesale' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Announcement Ribbon */}
      <div className={styles.announcement}>
        <div className={styles.announcementContent}>
          <span>Complimentary pan-India delivery on orders above ₹999</span>
          <span className={styles.separator}>•</span>
          <span>100% Real Indian Botanical Reductions • Zero Synthetic Colours</span>
          <span className={styles.separator}>•</span>
          <Link href="/wholesale" className={styles.announcementLink}>Commercial Cafe & Bar Supply →</Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className={styles.brand}>
            <span className={styles.brandTitle}>ARANYA</span>
            <span className={styles.brandSubtitle}>BOTANICALS • INDIA</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className={styles.desktopLinks}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                >
                  {link.label}
                  {link.badge && (
                    <span className={styles.navBadge}>
                      <Sparkles size={10} />
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Icons */}
          <div className={styles.actions}>
            <Link href="/account" className={styles.actionBtn} title={isAuthenticated ? `Account (${user?.name})` : 'Login / Account'}>
              <User size={20} />
              {isAuthenticated && user?.role === 'ADMIN' && (
                <span className={styles.adminDot} title="Admin Portal Active" />
              )}
            </Link>

            <Link href="/account" className={styles.actionBtn} title="Wishlist">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className={styles.badgeCount}>{wishlistItems.length}</span>
              )}
            </Link>

            <button
              onClick={openCart}
              className={`${styles.actionBtn} ${styles.cartBtn}`}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} />
              <span className={styles.badgeCount}>{totalCartCount}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={styles.mobileNav}>
            <div className={styles.mobileNavLinks}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${styles.mobileNavLink} ${pathname === link.href ? styles.activeMobileLink : ''}`}
                >
                  {link.label}
                  {link.badge && <span className={styles.navBadge}>{link.badge}</span>}
                </Link>
              ))}
              <div className={styles.mobileDivider} />
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className={styles.mobileNavLink}
              >
                {isAuthenticated ? `My Account (${user?.name})` : 'Sign In / Register'}
              </Link>
              {isAuthenticated && user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${styles.mobileNavLink} ${styles.adminLink}`}
                >
                  Admin Operations Console →
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

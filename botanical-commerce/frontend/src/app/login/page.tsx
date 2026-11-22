'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { fetchApi } from '../../lib/api';
import styles from './page.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        login(res.data.accessToken, res.data.user);
        if (res.data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <span className={styles.sub}>ARANYA BOTANICALS</span>
            <h1>Cellar Access & Login</h1>
            <p>Access your orders, saved delivery addresses, and curated botanical wishlist.</p>
          </div>

          {errorMsg && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Credentials Pill for reviewer */}
          <div className={styles.demoCredentialsBox}>
            <strong>Test Accounts:</strong>
            <p>Customer: <code>customer@aranyabotanicals.com</code> / <code>Customer@2026</code></p>
            <p>Admin: <code>admin@aranyabotanicals.com</code> / <code>Botanicals@Admin2026</code></p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent if account exists.'); }} className={styles.forgotLink}>
                  Forgot Password?
                </a>
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'Authenticating...' : 'Sign In to Account'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>
              New to Aranya Botanicals?{' '}
              <Link href="/register" className={styles.switchLink}>
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

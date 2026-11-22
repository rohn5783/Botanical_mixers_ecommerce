'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { fetchApi } from '../../lib/api';
import styles from '../login/page.module.scss';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'B2B_CUSTOMER'>('CUSTOMER');
  const [companyName, setCompanyName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
          companyName: role === 'B2B_CUSTOMER' ? companyName : undefined,
        }),
      });

      if (res.success && res.data) {
        login(res.data.accessToken, res.data.user);
        router.push('/account');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
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
            <h1>Create Account</h1>
            <p>Join the circle of Indian botanical beverage connoisseurs.</p>
          </div>

          {errorMsg && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Deshmukh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
              <label>10-Digit Mobile Phone</label>
              <div className={styles.inputWrapper}>
                <Phone size={18} className={styles.inputIcon} />
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="9820012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                style={{ padding: '10px 12px', borderRadius: '4px', border: '1px solid #D1C8BA' }}
              >
                <option value="CUSTOMER">Individual Consumer / Home Host</option>
                <option value="B2B_CUSTOMER">Hospitality Business / Cafe / Bar</option>
              </select>
            </div>

            {role === 'B2B_CUSTOMER' && (
              <div className={styles.inputGroup}>
                <label>Company / Cafe Name</label>
                <div className={styles.inputWrapper}>
                  <Building2 size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roastery Coffee House"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Password (Min 6 Characters)</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>
              Already have an account?{' '}
              <Link href="/login" className={styles.switchLink}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

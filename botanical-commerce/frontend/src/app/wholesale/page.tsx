'use client';

import React, { useState } from 'react';
import { Building2, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, Send, Droplets } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import styles from './page.module.scss';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: 'CAFE',
    gstin: '',
    city: '',
    state: '',
    estimatedMonthlyVolumeLiters: 20,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetchApi('/b2b/enquiries', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit enquiry. Please check fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wholesalePage}>
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroSub}>HOSPITALITY & BEVERAGE TRADE</span>
          <h1 className={styles.heroTitle}>B2B Botanical Wholesale Program</h1>
          <p className={styles.heroDesc}>
            Partner with Aranya Botanicals to elevate your cafe, cocktail lounge, hotel, or mocktail bar with high-yield pure Indian botanical concentrates.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Value Grid */}
        <div className={styles.valueGrid}>
          <div className={styles.vCard}>
            <div className={styles.vIcon}><Droplets size={24} /></div>
            <h3>1000ml Barista Packs</h3>
            <p>Designed for rapid bar execution with food-grade 10ml calibrated pump dispensers.</p>
          </div>
          <div className={styles.vCard}>
            <div className={styles.vIcon}><Building2 size={24} /></div>
            <h3>Tiered Trade Pricing</h3>
            <p>Direct-from-facility volume discounts, recurring scheduled dispatches, and GST invoicing.</p>
          </div>
          <div className={styles.vCard}>
            <div className={styles.vIcon}><ShieldCheck size={24} /></div>
            <h3>Menu Development & Training</h3>
            <p>Access our signature cocktail and mocktail formulation guides and staff beverage SOPs.</p>
          </div>
        </div>

        {/* Form Container */}
        <div className={styles.formContainer}>
          {submitted ? (
            <div className={styles.successCard}>
              <CheckCircle2 size={56} className={styles.successIcon} />
              <h2>Wholesale Enquiry Received</h2>
              <p>
                Thank you for connecting with Aranya Botanicals Trade. Our hospitality partnerships director will review your beverage specifications and dispatch a formal quotation within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    businessName: '',
                    contactPerson: '',
                    email: '',
                    phone: '',
                    businessType: 'CAFE',
                    gstin: '',
                    city: '',
                    state: '',
                    estimatedMonthlyVolumeLiters: 20,
                    message: '',
                  });
                }}
                className={styles.newEnquiryBtn}
              >
                Submit Another Trade Request
              </button>
            </div>
          ) : (
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2>Commercial Enquiry & Sample Request</h2>
                <p>Please provide your business and volume specifications to receive commercial tier pricing.</p>
              </div>

              {errorMsg && <p className={styles.errorAlert}>{errorMsg}</p>}

              <form onSubmit={handleSubmit} className={styles.b2bForm}>
                <div className={styles.formRowTwo}>
                  <div className={styles.inputGroup}>
                    <label>Business / Establishment Name *</label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. The Roastery Coffee House"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Contact Person & Designation *</label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="e.g. Raghav Sharma (Beverage Director)"
                    />
                  </div>
                </div>

                <div className={styles.formRowTwo}>
                  <div className={styles.inputGroup}>
                    <label>Work Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="raghav@roastery.in"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Business Phone / Mobile *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9820012345"
                    />
                  </div>
                </div>

                <div className={styles.formRowTwo}>
                  <div className={styles.inputGroup}>
                    <label>Business Classification *</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                    >
                      <option value="CAFE">Specialty Cafe / Roastery</option>
                      <option value="RESTAURANT">Fine Dining / Casual Restaurant</option>
                      <option value="MOCKTAIL_BAR">Cocktail & Mocktail Lounge</option>
                      <option value="HOTEL">Boutique Hotel / Luxury Resort</option>
                      <option value="CATERING">Events & Bar Catering</option>
                      <option value="DISTRIBUTOR">Beverage Distributor</option>
                      <option value="OTHER">Other Hospitality Trade</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>GSTIN (Optional for Quotation)</label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="27AABCT3518Q1ZV"
                    />
                  </div>
                </div>

                <div className={styles.formRowTwo}>
                  <div className={styles.inputGroup}>
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Bengaluru"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Karnataka"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Estimated Monthly Concentrate Volume (Liters) *</label>
                    <input
                      type="number"
                      name="estimatedMonthlyVolumeLiters"
                      min={5}
                      max={1000}
                      required
                      value={formData.estimatedMonthlyVolumeLiters}
                      onChange={handleChange}
                    />
                    <span className={styles.hintText}>Minimum 5 Liters for wholesale pricing tier.</span>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Beverage Program Details & Sample Kit Request *</label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your drink menu, desired botanicals (Kokum, Nannari, Jamun, Hibiscus), and delivery expectations..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? 'Submitting Trade Enquiry...' : 'Submit Wholesale Enquiry & Request Samples'}
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

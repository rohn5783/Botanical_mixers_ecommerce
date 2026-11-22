# ARANYA BOTANICALS — DESIGN TOKEN SYSTEM

## 1. Brand Identity & Design Principles
* **Authentic Indian Flora:** Grounded in Western Ghats Kokum, Tamil Nadu & Andhra Nannari Root, Konkan Jamun, and Malabar Hibiscus.
* **Artisanal Craftsmanship:** Warm tactile paper textures, deep forest greens, antique gold highlights, and rich botanical pigments.
* **Zero Artificiality:** No generic gradients, neon colors, glassmorphism blur traps, or arbitrary rounded cards. Every element reflects craft beverage bottling.

---

## 2. Color Tokens

### Primary Palette (Base & Structural)
```scss
$color-bg-primary: #FAF7F2;       // Warm linen ivory (Main background)
$color-bg-secondary: #F3EFE6;     // Muted parchment cream (Sections & sub-panels)
$color-bg-surface: #FFFFFF;       // Pure card surface
$color-bg-surface-elevated: #FFFFFF;
$color-bg-dark: #14241B;          // Deep forest canopy (Hero/Footer/B2B accent)
$color-bg-dark-surface: #1C3326;  // Deep botanical card surface

$color-forest-primary: #1A2F23;   // Core brand green
$color-forest-light: #2B4737;     // Secondary botanical green
$color-forest-dark: #0E1A13;      // Deepest midnight green

$color-gold-primary: #C8974E;     // Warm antique brass / gold
$color-gold-light: #DFC08A;       // Highlight gold
$color-gold-dark: #9E7432;        // Active/Pressed gold
```

### Botanical Pigment Tokens (Ingredient Theming)
```scss
// Kokum (Garcinia indica)
$color-kokum-primary: #932938;
$color-kokum-light: #F8E9EB;
$color-kokum-dark: #6B1C27;

// Nannari (Hemidesmus indicus)
$color-nannari-primary: #7A5435;
$color-nannari-light: #F6EFEA;
$color-nannari-dark: #523722;

// Jamun (Syzygium cumini)
$color-jamun-primary: #4E1D3B;
$color-jamun-light: #F4EAF0;
$color-jamun-dark: #351328;

// Hibiscus (Hibiscus sabdariffa)
$color-hibiscus-primary: #A62B47;
$color-hibiscus-light: #FAEAEE;
$color-hibiscus-dark: #771D32;
```

### Neutral & Typography Tokens
```scss
$color-text-primary: #19211D;     // Charcoal pine (High contrast reading)
$color-text-secondary: #515C56;   // Muted slate botanical
$color-text-tertiary: #7F8B85;    // Subtle captions & labels
$color-text-light: #FAF7F2;       // Ivory text on dark surfaces
$color-text-muted-light: #A5B5AC;// Muted text on dark surfaces

$color-border-subtle: #E8E2D8;    // Warm hairline divider
$color-border-medium: #D1C8BA;    // Input & card border
$color-border-dark: #2B4234;      // Divider on dark panels

$color-success: #2E6F40;
$color-warning: #B87A1E;
$color-error: #A82D2D;
$color-info: #2B6282;
```

---

## 3. Typography System

```scss
// Fonts
$font-family-display: 'Playfair Display', Georgia, serif;
$font-family-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
$font-family-mono: 'JetBrains Mono', SFMono-Regular, monospace;

// Type Scale
$font-size-xs: 0.75rem;    // 12px - Badges, legal, dilution specs
$font-size-sm: 0.875rem;   // 14px - Body small, secondary metadata
$font-size-base: 1rem;     // 16px - Default body text
$font-size-md: 1.125rem;   // 18px - Lead paragraphs, prominent body
$font-size-lg: 1.25rem;    // 20px - Subheadings, card titles
$font-size-xl: 1.5rem;     // 24px - Section headers (h4)
$font-size-2xl: 1.875rem;  // 30px - Subsection hero (h3)
$font-size-3xl: 2.25rem;   // 36px - Main page headers (h2)
$font-size-4xl: 3rem;      // 48px - Primary hero headlines (h1)
$font-size-5xl: 3.75rem;   // 60px - Display banner statements

// Line Heights
$line-height-tight: 1.15;
$line-height-snug: 1.3;
$line-height-base: 1.6;
$line-height-relaxed: 1.75;

// Font Weights
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

---

## 4. Spacing, Radii & Shadow Tokens

```scss
// Spacing Grid (8pt system)
$space-1: 0.25rem;  // 4px
$space-2: 0.5rem;   // 8px
$space-3: 0.75rem;  // 12px
$space-4: 1rem;     // 16px
$space-5: 1.25rem;  // 20px
$space-6: 1.5rem;   // 24px
$space-8: 2rem;     // 32px
$space-10: 2.5rem;  // 40px
$space-12: 3rem;    // 48px
$space-16: 4rem;    // 64px
$space-20: 5rem;    // 80px
$space-24: 6rem;    // 96px

// Border Radii (Conservative, Architectural, Bottling-Grade)
$radius-none: 0;
$radius-xs: 2px;
$radius-sm: 4px;
$radius-md: 8px;     // Standard for cards, inputs, buttons
$radius-lg: 12px;    // Elevated modals & discovery boxes
$radius-full: 9999px;// Pills & badges only

// Shadows (Subtle, diffused, natural lighting)
$shadow-sm: 0 1px 3px rgba(25, 33, 29, 0.05);
$shadow-md: 0 4px 12px rgba(25, 33, 29, 0.08);
$shadow-lg: 0 10px 25px rgba(25, 33, 29, 0.10);
$shadow-lift: 0 14px 30px rgba(25, 33, 29, 0.12);
```

---

## 5. Component Styling Rules

### 1. Buttons
- **Primary:** Solid Forest Green (`$color-forest-primary`), Ivory text (`$color-bg-primary`), subtle antique gold border on hover.
- **Secondary (Gold):** Antique Gold (`$color-gold-primary`), dark pine text, deep gold border.
- **Outline:** Transparent background, `$color-border-medium`, hover to `$color-forest-primary` with light background.
- **Pills / Badges:** Uppercase `$font-family-mono`, 11px font size, tracking +0.08em.

### 2. Product Cards
- Clean aspect ratio (3:4 or 4:5 vertical proportion).
- Soft warm ivory frame with 1px border (`$color-border-subtle`).
- Botanical ingredient indicator dot / badge (Kokum red, Nannari earth, Jamun plum, Hibiscus ruby).
- Clear dilution ratio pill (e.g. `1:5 RATIO • ~15 DRINKS`).
- Price formatted in Indian Rupees (₹) with integer minor units (paise converted).

### 3. Serving Calculator
- Clean interactive sliders.
- Displays: "Concentrate needed: 450 mL | Still/Soda base: 2,250 mL | Yield: 15 Glasses of 180ml".
- Dynamic cost per serving indicator.

### 4. Interactive Drink Builder
- Step 1: Base concentrate selector with flavor radar notes.
- Step 2: Carbonation / Water base (Still RO, Himalayan Sparkling, Soda Water).
- Step 3: Botanical accents (Crushed Mint, Fresh Ginger reduction, Lemon zest, Black salt).
- Step 4: Live mixology ratio sheet and 1-click add to cart.

# UI IMPLEMENTATION PLAN & ARCHITECTURE MAPPING

## 1. Overview & Technology Alignment

* **Frontend:** Next.js (App Router), TypeScript, SCSS Modules, Framer Motion, TanStack Query, React Hook Form, Zod, Zustand.
* **Backend:** Express.js, TypeScript, REST APIs, Mongoose + MongoDB, Razorpay, Cloudinary, Resend.
* **Database Models:** 18 standard schemas with integer minor units (paise) and MongoDB transaction-safe operations.

---

## 2. Page & Route Specifications

| Route | Page / Module | Key Components & Functionality |
| :--- | :--- | :--- |
| `/` | **Homepage** | Brand Hero, Botanical Ingredient Ribbon, Best Sellers Carousel, The Concentrate Advantage (Why Concentrates?), Botanical Deep-Dive grid, Featured Recipes, 3-Step Drink Preparation Guide, Heritage Sourcing Story, B2B Partnership Banner, Testimonials, Newsletter. |
| `/shop` | **Catalogue & Shop** | Multi-filter sidebar (Category, Botanical, Price slider, Sugar-free / Organic, In-stock), Sorting (Price, Best-seller, Newest), Search bar, Grid view with dynamic Variant Selector, Wishlist toggle, Quick-Add. |
| `/products/[slug]` | **Product Detail Page** | Image gallery with thumbnail switch, Variant selection (250ml, 500ml, 1L cafe size), Dynamic Serving Calculator, Botanical Sensory Profile, Dilution & Usage Guide, Detailed Ingredients & Nutrition Facts table, FSSAI compliance badge, Customer Reviews with star rating, Related Products carousel, Add-to-Cart & Buy Now. |
| `/botanicals` | **Botanical Discovery Hub** | Overview of native Indian flora: Western Ghats Kokum, Southern Nannari Root, Konkan Jamun, Malabar Hibiscus. |
| `/botanicals/[slug]` | **Individual Botanical Story** | Botanical history, sourcing region map, scientific classification, natural properties, harvest method, paired concentrate products, signature recipes. |
| `/recipes` | **Recipe Platform** | Filter by category (Mocktails, Sparkling Drinks, Artisanal Lemonades, Iced Botanicals), difficulty level, prep time. |
| `/recipes/[slug]` | **Recipe Detail** | High-res cocktail/mocktail hero, Prep time & Yield, Ingredient list with exact dilution ratios, Step-by-step mixologist method, Direct "Add Required Concentrates to Cart" button. |
| `/drink-builder` | **Interactive Drink Builder** | 4-step mixology workshop: 1) Select Botanical Concentrate -> 2) Select Effervescence Base -> 3) Add Fresh Botanical Accents -> 4) Custom Recipe Generation with exact proportions & Add-to-Cart. |
| `/collections` | **Product Bundles** | Curated collections: Discovery Box (All 4 Botanicals), Indian Heritage Trio, Floral & Citrus Collection, Cafe Barista Starter Pack. Direct bundle add-to-cart. |
| `/cart` | **Shopping Cart** | Slide-over drawer and dedicated `/cart` page. Real-time quantity adjustments, discount coupon validation, free shipping progress bar (e.g. "Add ₹200 more for Free Express Delivery"), order subtotal, GST calculation, checkout CTA. |
| `/checkout` | **Checkout Flow** | Multi-step streamlined checkout: 1) Customer Contact, 2) Delivery Address, 3) Shipping Option, 4) Order Review, 5) Razorpay Gateway Payment with verified server-side signature. |
| `/login` & `/register` | **Authentication** | Customer / B2B portal login, secure password verification, JWT cookies/tokens, password recovery with reset tokens. |
| `/account/*` | **Customer Dashboard** | Overview, Order History with status timeline (Placed, Confirmed, Shipped, Delivered), Order detail modal, Saved Addresses CRUD, Wishlist grid, Review submissions. |
| `/wholesale` | **B2B Wholesale Portal** | Business tier introduction (Cafes, Cocktail Bars, Hotels, Catering), Tiered pricing info, Formal B2B Wholesale Enquiry Form, Business details & GSTIN verification, Quotation request submission. |
| `/admin/*` | **Admin Dashboard** | Operational console: Analytics KPI cards (Revenue, Orders, Low Stock, B2B Enquiries), Product CRUD with image upload & variants, Order status manager & shipping tracking, B2B Enquiry review & Quotation generator, Inventory manager with stock replenishment alerts, Content manager. |

---

## 3. SCSS Modular Architecture

```
frontend/src/styles/
├── _variables.scss      # Colors, typography, spacing, shadows, radii
├── _mixins.scss         # Responsive breakpoints, flex/grid helpers, line clamp
├── _reset.scss          # Clean box-sizing, typography reset, button resets
├── _typography.scss     # Font-face imports, heading styles, utility typography
└── globals.scss         # Global root definitions, animations, scrollbars
```

Every page and component will use localized SCSS modules (e.g., `ProductCard.module.scss`, `ServingCalculator.module.scss`, `DrinkBuilder.module.scss`, `Checkout.module.scss`) importing `_variables.scss` and `_mixins.scss`.

---

## 4. State Management & API Integration
* **Zustand Stores:**
  - `useCartStore`: Cart state, guest cart persistence in `localStorage`, sync with backend API on login.
  - `useAuthStore`: Authenticated user profile, JWT token, role checking (`CUSTOMER`, `B2B_CUSTOMER`, `ADMIN`).
  - `useWishlistStore`: Wishlist items management.
* **TanStack Query:**
  - Dynamic caching and background revalidation for product catalogue, botanical profiles, recipes, user orders, and admin dashboard metrics.
* **Form Validation:**
  - `react-hook-form` with `zod` schemas for Checkout, Login/Register, B2B Enquiry, and Admin Product creation.

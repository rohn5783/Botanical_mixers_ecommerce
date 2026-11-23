# 🌿 ARANYA BOTANICALS — PREMIUM BOTANICAL BEVERAGE COMMERCE PLATFORM

> **Artisanal Indian Botanical Beverage Concentrates**  
> Direct-to-Consumer (D2C) & Commercial Hospitality (B2B) E-Commerce Architecture

---

## 1. Project Overview

**Aranya Botanicals** is an artisanal beverage commerce platform celebrating indigenous Indian botanical terroir. Moving away from synthetic neon syrups, artificial flavor essences, and single-use carbonated cans, Aranya engineers pure, cold-reduced botanical concentrates from:
1. **Wild Western Ghats Kokum** (*Garcinia indica*) — Maharashtra & Goa
2. **Heritage Nannari Root** (*Hemidesmus indicus*) — Tamil Nadu & Andhra Pradesh
3. **Konkan Coast Jamun** (*Syzygium cumini*) — Maharashtra
4. **Malabar Wild Hibiscus** (*Hibiscus sabdariffa*) — Kerala

The platform serves two primary commercial tiers:
* **D2C Connoisseurs & Home Mixologists:** Online product discovery, dynamic serving calculator, interactive 4-step Drink Builder studio, recipe hub with 1-click add-to-cart, tasting flight discovery boxes, and Razorpay checkout.
* **B2B Hospitality Partners (HoReCa):** 1000ml commercial barista packs with 10ml calibrated pump dispensers, wholesale trade enquiry flow, automated quotation generation, and dedicated business dashboard.

---

## 2. Technology Stack

### Frontend
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Modular SCSS (Zero generic UI frameworks; strict design tokens based on real beverage brands)
* **State Management:** Zustand (Cart & Auth persistence with guest/user session sync)
* **Server State:** TanStack React Query
* **Animations:** Framer Motion
* **Forms & Validation:** React Hook Form & Zod
* **Icons:** Lucide React

### Backend
* **Runtime:** Node.js (v20+)
* **Framework:** Express.js (REST API architecture)
* **Language:** TypeScript
* **Security:** Helmet, CORS, Express Rate Limit, bcryptjs
* **Authentication:** JWT (Stateless access tokens & refresh tokens with RBAC: `CUSTOMER`, `ADMIN`, `B2B_CUSTOMER`)

### Database & Storage
* **Database:** MongoDB 7.0+ with Mongoose 8.x
* **Zero-Setup Embedded Database:** Includes embedded in-memory MongoDB engine fallback for instant plug-and-play development and automated test suites.
* **Monetary Units:** Strictly stored as integer minor units (paise in INR) to prevent floating-point calculation errors.

### Third-Party Integrations
* **Payments:** Razorpay (Server-side order creation, HMAC-SHA256 cryptographic signature verification, and idempotent webhook handling)
* **Media Assets:** Cloudinary image optimization
* **Transactional Email:** Resend API (Order confirmation & invoice dispatch)
* **Caching & Queues:** Redis & BullMQ architecture ready

---

## 3. Researched Design System

The visual identity is based on in-depth research of leading premium beverage brands (**SWA Drinks**, **MONIN India**, **Twisted Tails**, **Sepoy & Co.**, and **ROOTARI**):
* **Linen Canvas (`#FAF6F5`):** Warm, organic paper texture.
* **Deep Imperial Maroon (`#5A111C` & `#1D0A0F`):** Royal botanical authority and grounding luxury.
* **Antique Brass (`#C8974E`):** Warm artisan foil accents.
* **Botanical Terroir Pigments:**
  - Kokum Crimson: `#932938`
  - Nannari Sarsaparilla Earth: `#7A5435`
  - Jamun Velvet Plum: `#4E1D3B`
  - Malabar Hibiscus Ruby: `#A62B47`
* **Typography:** Editorial Serif (`Playfair Display`), Humanist Sans (`Plus Jakarta Sans`), and Technical Monospace (`JetBrains Mono`).

---

## 4. Folder Structure

```
botanical-commerce/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection & Zod environment validation
│   │   ├── constants/          # Constants, GST rates, HSN codes, FSSAI lic
│   │   ├── controllers/        # Thin Express controllers (Auth, Product, Cart, Order, etc.)
│   │   ├── integrations/       # Razorpay, Cloudinary, Resend
│   │   ├── middlewares/        # JWT Auth, Role RBAC, ErrorHandler, RateLimit
│   │   ├── models/             # 18 Mongoose Schemas (User, Product, Order, Inventory...)
│   │   ├── routes/             # Modular REST API endpoints (/api/v1)
│   │   ├── services/           # Decoupled business logic & transaction handling
│   │   ├── types/              # TypeScript interfaces & Enums
│   │   ├── utils/              # Password hashing, JWT signing, DB Seeder
│   │   ├── app.ts              # Express application configuration
│   │   └── server.ts           # Server entry point with auto-seeding
│   ├── tests/                  # Supertest & Jest integration test suite
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router routes
│   │   │   ├── page.tsx        # 13-section Homepage
│   │   │   ├── shop/           # Product catalogue with multi-filter sidebar
│   │   │   ├── products/[slug]/# Product detail page with Serving Calculator
│   │   │   ├── botanicals/     # Botanical terroir hub & deep-dive pages
│   │   │   ├── recipes/        # Recipe hub & detail with Recipe-to-Cart
│   │   │   ├── drink-builder/  # Interactive 4-step mixology workshop
│   │   │   ├── collections/    # Tasting flights & Discovery Box bundles
│   │   │   ├── cart/           # Shopping cart page with coupon engine
│   │   │   ├── checkout/       # Multi-step checkout with Razorpay modal
│   │   │   ├── wholesale/      # B2B trade enquiry portal
│   │   │   ├── account/        # Customer dashboard (Orders, Wishlist, Addresses)
│   │   │   ├── admin/          # Executive operations console & analytics
│   │   │   └── login/ & register/ # Secure authentication
│   │   ├── components/         # Modular layout, product, and recipe components
│   │   ├── stores/             # Zustand stores (useCartStore, useAuthStore, useWishlistStore)
│   │   ├── styles/             # Shared SCSS variables, mixins, and globals
│   │   └── types/              # Frontend TypeScript models
│   ├── package.json
│   └── tsconfig.json
│
├── documentation/
│   ├── DESIGN_RESEARCH.md      # Competitive benchmarking of 8 beverage brands
│   ├── DESIGN_SYSTEM.md        # Color tokens, typography, and component specs
│   ├── UI_IMPLEMENTATION_PLAN.md # Architectural route and module mapping
│   ├── API_DOCUMENTATION.md    # REST API endpoint reference
│   └── DATABASE_SCHEMA.md      # MongoDB collections & Mongoose schemas
└── README.md
```

---

## 5. Installation & Quick Start

### Prerequisites
* Node.js v20+ or v24+
* pnpm (recommended) or npm

### 1. Backend Setup
```bash
cd botanical-commerce/backend
pnpm install
```

Configure your `.env` file (sample provided in `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/aranya_botanicals
FRONTEND_URL=http://localhost:3000
JWT_SECRET=aranya_botanicals_super_secure_jwt_secret_2026_botanicals_india
RAZORPAY_KEY_ID=rzp_test_aranyaBotanicalsKey123
RAZORPAY_KEY_SECRET=rzp_test_secretKeyAranya98765
RAZORPAY_WEBHOOK_SECRET=aranya_webhook_secret_razorpay_2026
```
*(Note: If a local MongoDB instance is not detected, the backend automatically initializes an embedded in-memory MongoDB instance with pre-seeded botanical products, recipes, and test accounts!)*

### 2. Frontend Setup
```bash
cd botanical-commerce/frontend
pnpm install
```

Configure `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_aranyaBotanicalsKey123
```

---

## 6. Running the Applications

### Start Backend Server:
```bash
cd botanical-commerce/backend
pnpm dev
# API listening at: http://localhost:5000/api/v1
# Health Check: http://localhost:5000/health
```

### Start Frontend Dev Server:
```bash
cd botanical-commerce/frontend
pnpm dev
# Storefront running at: http://localhost:3000
```

---

## 7. Pre-Configured Test Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@aranyabotanicals.com` | `Botanicals@Admin2026` | Full access to `/admin` operational console, product CRUD, order manager, B2B quotations, and stock adjustments. |
| **Customer** | `customer@aranyabotanicals.com` | `Customer@2026` | Access to `/account` customer dashboard, order history, addresses, and wishlist. |
| **B2B Partner** | `partner@tajhotels.com` | `B2BPartner@2026` | Hospitality trade account access. |

---

## 8. Running Test Suites

Run the comprehensive integration test suite verifying health endpoints, authentication, product catalogue filters, dilution ratios, cart calculations, coupon validation, paise order creation, B2B wholesale enquiries, and admin operations:

```bash
cd botanical-commerce/backend
pnpm test
```

---

## 9. Production Deployment

### Backend Build:
```bash
cd botanical-commerce/backend
pnpm build
pnpm start
```

### Frontend Build:
```bash
cd botanical-commerce/frontend
pnpm build
pnpm start
```

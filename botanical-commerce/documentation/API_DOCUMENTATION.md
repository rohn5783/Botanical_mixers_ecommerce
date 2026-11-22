# ARANYA BOTANICALS — REST API DOCUMENTATION

Base URL: `http://localhost:5000/api/v1`

All responses follow a consistent envelope structure:
```json
{
  "success": true,
  "message": "Human readable confirmation",
  "data": { ... }
}
```

Monetary values are strictly formatted as integer minor units (paise in INR, e.g. ₹749.00 = `74900` paise).

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/register`
Creates a customer or B2B customer profile.
* **Payload:**
```json
{
  "name": "Ananya Deshmukh",
  "email": "ananya@example.com",
  "password": "Password123",
  "phone": "9820012345",
  "role": "CUSTOMER",
  "companyName": ""
}
```
* **Response (201):** Returns JWT `accessToken`, `refreshToken`, and user payload.

### `POST /auth/login`
Authenticates existing account.
* **Payload:** `{ "email": "...", "password": "..." }`
* **Response (200):** Returns JWT access/refresh tokens.

### `POST /auth/refresh-token`
Generates a new access token using a valid refresh token.

### `GET /auth/profile`
* **Headers:** `Authorization: Bearer <accessToken>`
* **Response (200):** User details (excluding password hash).

---

## 2. Botanical Concentrates & Catalogue (`/products`)

### `GET /products`
Queries botanical products with multi-faceted filtering.
* **Query Parameters:**
  - `category` (string, e.g. `kokum`, `nannari`, `jamun`, `hibiscus`, `botanical-blends`, `discovery-kits`)
  - `botanical` (string, e.g. `kokum`, `nannari`, `jamun`, `hibiscus`)
  - `minPrice` / `maxPrice` (integers in paise)
  - `search` (text search in name, description, tags)
  - `sort` (`featured`, `newest`, `price_asc`, `price_desc`, `rating`)
  - `page` (number, default: 1)
  - `limit` (number, default: 12)

### `GET /products/:slug`
Retrieves product details, botanical dilution ratios, estimated servings, nutritional breakdown, and related concentrates.

### `POST /products` (Admin Only)
Creates a new concentrate formulation and initializes inventory records.

---

## 3. Botanical Terroir Discovery (`/botanicals`)

### `GET /botanicals`
Returns the 4 core Indian flora:
1. Kokum (*Garcinia indica*)
2. Nannari Root (*Hemidesmus indicus*)
3. Jamun (*Syzygium cumini*)
4. Indian Hibiscus (*Hibiscus sabdariffa*)

### `GET /botanicals/:slug`
Deep-dive into botanical history, harvesting methods, traditional uses, associated concentrate products, and signature recipes.

---

## 4. Recipe Platform (`/recipes`)

### `GET /recipes`
Returns recipes categorized by `MOCKTAIL`, `SPARKLING`, `LEMONADE`, and `SIGNATURE`.
* **Query Parameters:** `category`, `difficulty`

### `GET /recipes/:slug`
Step-by-step mixology method, glassware, garnish, exact dilution parts, and linked concentrates.

---

## 5. Shopping Cart (`/cart`)

Supports both authenticated customers (`Authorization: Bearer <token>`) and guest visitors (`x-guest-token: <uuid>`).

### `GET /cart`
Retrieves active basket.

### `POST /cart/items`
Adds an item to the basket with real-time inventory validation.
* **Payload:** `{ "productId": "...", "variantSku": "AB-KOKUM-500", "quantity": 2 }`

### `PATCH /cart/items/:variantSku`
Updates item quantity or removes if quantity is 0.

### `DELETE /cart/items/:variantSku`
Removes variant from the basket.

### `POST /cart/coupon`
Validates and applies promotional code (e.g. `BOTANICAL10`).

---

## 6. Orders & Checkout (`/orders`)

### `POST /orders`
Creates a confirmed order from active basket.
* **Payload:**
```json
{
  "customerEmail": "ananya@example.com",
  "customerPhone": "9820012345",
  "shippingAddress": {
    "fullName": "Ananya Deshmukh",
    "phone": "9820012345",
    "streetAddress": "42 Marine Drive",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400021",
    "country": "India"
  },
  "customerNotes": "Fragile glass bottle packaging"
}
```
* **Processing:**
  - Validates stock across variants.
  - Automatically calculates free shipping (free above ₹999, else ₹80).
  - Calculates 12% GST.
  - Generates unique order number: `AB-YYYYMMDD-XXXX`.
  - Atomically reserves inventory.

### `GET /orders`
Lists all historical orders for authenticated user.

### `GET /orders/:id`
Retrieves single order with itemized breakdown and tracking courier details.

---

## 7. Payments & Razorpay (`/payments`)

### `POST /payments/create-order`
Creates server-side Razorpay order.
* **Payload:** `{ "orderId": "..." }`
* **Response:** `{ "razorpayOrderId": "order_xxx", "amountInPaise": 74900, "currency": "INR" }`

### `POST /payments/verify`
Performs cryptographic HMAC-SHA256 signature verification.
* **Payload:**
```json
{
  "orderId": "...",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "hex_hmac_hash"
}
```
* **Action:**
  - Verifies signature using `RAZORPAY_KEY_SECRET`.
  - Updates order payment status to `PAID`.
  - Deducts available inventory stock.
  - Dispatches transactional confirmation email via Resend.

### `POST /payments/webhook`
Idempotent webhook endpoint verifying `x-razorpay-signature`.

---

## 8. B2B Wholesale & Quotations (`/b2b`)

### `POST /b2b/enquiries`
Submits commercial enquiry for cafes, bars, hotels, or distributors.
* **Payload:**
```json
{
  "businessName": "The Roastery Coffee House",
  "contactPerson": "Raghav Sharma",
  "email": "raghav@roastery.in",
  "phone": "9820012345",
  "businessType": "CAFE",
  "city": "Bengaluru",
  "state": "Karnataka",
  "estimatedMonthlyVolumeLiters": 40,
  "message": "Looking for Nannari and Kokum concentrate supply."
}
```

### `GET /b2b/enquiries` (Admin Only)
Reviews pending trade enquiries.

### `POST /b2b/quotations` (Admin Only)
Generates formal commercial quotation with volume pricing and credit terms.

---

## 9. Executive Admin Console (`/admin`)

Requires `ADMIN` role.

* `GET /admin/dashboard`: Revenue, total orders, active customers, low stock count.
* `GET /admin/analytics`: 7-day revenue trend and best-selling botanical products.
* `GET /admin/orders`: Complete order management with status filters.
* `PATCH /admin/orders/:id/status`: Updates fulfillment status (`CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`) and courier tracking.
* `GET /admin/inventory`: Variant stock levels, low-stock threshold alerts.
* `PATCH /admin/inventory/stock`: Adjusts variant stock levels with audit reason.

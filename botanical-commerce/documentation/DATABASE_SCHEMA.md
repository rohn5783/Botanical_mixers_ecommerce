# ARANYA BOTANICALS — DATABASE ARCHITECTURE & SCHEMA SPECIFICATION

Database Engine: **MongoDB 7.0+**  
Object Data Modeling (ODM): **Mongoose 8.x**  
Monetary Values: **Integer Minor Units (Paise in INR)**

---

## Collections Overview (18 Schemas)

| Collection | Description | Key Indexes |
| :--- | :--- | :--- |
| `users` | Customer, Admin, and B2B trade accounts | `email` (unique), `role` |
| `products` | Botanical concentrates, discovery boxes, blends | `slug` (unique), `category`, `botanicalIngredient`, text index on `name`, `description`, `tags` |
| `categories` | Product classification taxonomy | `slug` (unique), `isActive` |
| `botanicalIngredients` | Sourcing, botanical terroir, scientific names | `slug` (unique), `isActive` |
| `recipes` | Formulated mixology recipes & serves | `slug` (unique), `category`, `isFeatured` |
| `carts` | Customer & guest cart sessions | `userId`, `guestToken` |
| `orders` | Commercial transactions and dispatches | `orderNumber` (unique), `user`, `status`, `paymentStatus` |
| `payments` | Gateway transactions & cryptographic logs | `razorpayOrderId`, `orderId` |
| `addresses` | Saved customer addresses for shipping | `user`, `isDefault` |
| `reviews` | Verified connoisseur reviews | `product`, `user` |
| `wishlists` | Saved customer wishlist items | `user` (unique) |
| `inventory` | Real-time variant stock, thresholds, and audit trails | `product`, `variantSku` (indexed) |
| `b2bEnquiries` | Wholesale requests from cafes, bars, and hotels | `email`, `status`, `businessType` |
| `quotations` | Formal commercial pricing quotes | `quotationNumber` (unique), `enquiry` |
| `subscriptions` | Recurring botanical replenishment deliveries | `user`, `status`, `nextDeliveryDate` |
| `coupons` | Promotional discounts & campaigns | `code` (unique), `isActive` |
| `notifications` | Status notifications for users & admins | `user`, `recipientRole` |
| `auditLogs` | Administrative actions and stock adjustments | `entity`, `actorId`, `createdAt` |

---

## Integer Minor Unit Monetary Standard
To prevent binary floating-point roundoff errors (e.g. `0.1 + 0.2 = 0.30000000000000004`), every financial field in Aranya Botanicals is stored as integer paise:
* `₹449.00` = `44900`
* `₹749.00` = `74900`
* `₹1,299.00` = `129900`
* `₹1,699.00` = `169900`

---

## Inventory Reservation & Deductions
* When an order is placed (`POST /api/v1/orders`), inventory is immediately reserved (`reservedStock += quantity`) to prevent overselling.
* When payment is verified by Razorpay (`POST /api/v1/payments/verify`), `availableStock -= quantity` and `reservedStock -= quantity`.
* If an order is cancelled, `reservedStock -= quantity` is restored.

# 360 Eatery — Product Roadmap

360 Eatery is an online ordering system built around the restaurant's real workflow: customers order from the menu, pay, and either **pick up at the counter** or get it **delivered**. The kitchen manages orders, menu and stock from an admin dashboard. Each milestone below is a small, self-contained step.

## Use cases (kept simple)

| Actor | Use cases |
|---|---|
| **Customer** | Register · Login · Browse/Search Food · View Food Details · Add to Cart · Place Order · Make Payment · Track Order · View Order History · Manage Profile |
| **Restaurant Admin** | Login · Manage Menu · Manage Orders · Update Order Status · Manage Inventory · View Sales Reports |
| **Delivery Rider** *(only if 360 Eatery runs its own riders)* | Login · View Assigned Orders · Update Delivery Status · Confirm Delivery |
| **Payment Gateway** *(external system)* | Process Payment |

Relationships:

- Place Order → «include» Select Delivery Option (pickup or delivery)
- Place Order → «include» Provide Delivery Address *(only when delivery is chosen — strictly an «extend» if pickup is the norm)*
- Make Payment → «include» Process Payment (Payment Gateway)
- Manage Menu → «include» Add Food, Edit Food, Remove Food
- Manage Orders → «include» Update Order Status

> **Decision needed:** if 360 Eatery is pickup-only, drop the Delivery Rider actor, the "Delivery" option and the address step. If deliveries go through a third party (e.g. a dispatch company), keep the delivery option but skip Milestone 6.

## Milestones

### ✅ 1. Product surface (done)
Branded storefront and admin screens running on stubbed data (`src/data/fixtures.ts`) with a browser-local store (`src/lib/store.tsx`):
landing page, menu browse/search, food details with extras, cart, checkout (pickup/delivery, address, payment choice), order tracking, order history, admin orders board with status updates, sales chart, and menu & inventory management.

### 2. Data model & persistence
- Netlify Database (Postgres + Drizzle) tables: `menu_items`, `menu_extras`, `orders`, `order_lines`, `customers`, `staff`.
- Seed from the current fixtures; replace the real menu and prices.
- TanStack Start server functions for menu reads, placing orders, and status updates; swap `useStore` internals to call them.
- Food photo uploads via Netlify Blobs.

### 3. Customer accounts
- Register / Login / password reset with Netlify Identity.
- Order history and tracking tied to the signed-in customer (guest checkout by phone number still allowed).
- Manage Profile: name, phone, saved delivery addresses.

### 4. Staff login & roles
- Netlify Identity roles: `admin`, `staff` (and `rider` if Milestone 6 applies).
- Protect `/admin/*` routes and admin server functions.
- Optional: Manage Staff screen (invite/remove staff) — only if the team needs it.

### 5. Payments
- Integrate a payment gateway (Paystack or Flutterwave for Naira cards/transfers; Stripe is already a dependency).
- Webhook marks orders as paid; failed/abandoned payments never reach the kitchen.
- Keep "Pay on arrival" for pickup customers.

### 6. Delivery rider app *(only if 360 Eatery uses its own riders)*
- Rider login, View Assigned Orders, Update Delivery Status, Confirm Delivery (e.g. with a code from the customer).
- Admin assigns ready delivery orders to a rider.

### 7. Live updates & reports
- Real-time order updates for customers and the kitchen (polling or server-sent events).
- Sales reports from real data: daily/weekly revenue, best-sellers, pickup vs delivery split, CSV export.
- Low-stock alerts and automatic "sold out" when stock hits zero.

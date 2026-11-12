# AGENTS.md

360 Eatery — an online food ordering system (customer storefront + restaurant admin). Built with TanStack Start, deployed on Netlify.

**Continue from [PLAN.md](./PLAN.md).** Milestone 1 (product surface on stubbed data) is complete; start at Milestone 2.

## Architecture

- All data comes from `src/data/fixtures.ts` (menu, sample orders, weekly sales, restaurant info, types, `naira()` and `cdn()` helpers).
- `src/lib/store.tsx` is a React context (`StoreProvider` / `useStore`) holding menu, cart, orders and the customer's own order IDs. It persists to `localStorage` (`360:*` keys) and listens for `storage` events so admin and customer tabs stay in sync. **Milestone 2 replaces its internals with server functions + Netlify Database; keep the `useStore` API so screens don't change.**
- Payment in `/checkout` is simulated (timeout). Real gateway is Milestone 5.
- Order status flow depends on fulfilment type — see `statusFlow()` in fixtures: pickup goes `placed → confirmed → preparing → ready → completed`; delivery uses `out_for_delivery` instead of `ready`.

## Key directories

```
src/
  components/   Layout (Header/Footer/Logo), FoodCard, OrderStatus (badge + tracker)
  data/         fixtures.ts — the single stub-data module
  lib/          store.tsx — client store
  routes/       index, menu/, cart, checkout, orders/, admin/ (index = orders & sales, menu = menu & inventory)
public/img/     AI-generated dish photos (PNG); always reference via cdn(file, width)
```

## Conventions

- Tailwind 4 with theme tokens in `src/styles.css` (`ink`, `cream`, `sand`, `ember`, `saffron`, `leaf`; fonts `font-display` Fraunces, `font-sans` Manrope). Utility classes `.btn`, `.btn-ember`, `.btn-ghost`, `.field`, `.rise`.
- Prices are whole Naira integers; format with `naira()`.
- Images go through Netlify Image CDN: `cdn('jollof.png', 640)`.
- Import with the `@/` alias. Components PascalCase.

## Non-obvious decisions

- The menu, prices, address and phone are 360 Eatery Kano's real content (supplied by the owner). Opening hours, delivery/service fees, dish photos, extras and stock levels are still placeholders. localStorage keys are versioned (`360:v2:*`); bump the version if fixture changes must reach browsers that cached the old data.
- Delivery is offered alongside pickup; whether 360 Eatery needs a Delivery Rider role is an open owner decision (PLAN.md, Milestone 6).
- The food details route resolves the dish in the component (not the loader) because admin-added dishes only exist client-side in Milestone 1.
- `stripe` remains in package.json from the starter; Milestone 5 decides between Paystack/Flutterwave/Stripe.

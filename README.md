# 360 Eatery

Online ordering for 360 Eatery. Customers browse the menu, customise dishes, check out for **pickup or delivery**, pay, and follow their order live. Restaurant staff run a kitchen dashboard to accept and progress orders, manage the menu and stock, and see sales.

## Screens

| Route | Screen |
|---|---|
| `/` | Landing page with popular dishes and categories |
| `/menu` | Browse & search the menu, filter by category |
| `/menu/:foodId` | Food details, extras, quantity, add to cart |
| `/cart` | Cart with quantity controls |
| `/checkout` | Pickup/delivery choice, delivery address, payment |
| `/orders` | Order history |
| `/orders/:orderId` | Live order tracking |
| `/admin` | Live orders board, status updates, sales report |
| `/admin/menu` | Add/edit/remove food, availability, inventory |

The current release runs on sample data stored in the browser, so the customer and admin screens stay in sync in the same browser (open `/admin` in another tab and move an order along).

## Tech

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing) on Netlify
- Tailwind CSS 4, lucide-react icons
- Netlify Image CDN for dish photography

## Run locally

```bash
pnpm install
netlify dev    # or: pnpm dev
```

## Roadmap

See [PLAN.md](./PLAN.md): database persistence, customer accounts, staff login and roles, payment gateway, an optional delivery-rider app, and live updates & reports.

import { Link, useRouterState } from '@tanstack/react-router'
import { ShoppingBag, Receipt, ChefHat } from 'lucide-react'
import { useStore } from '@/lib/store'
import { restaurant } from '@/data/fixtures'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="relative grid place-items-center h-10 w-10 rounded-full bg-ember text-white font-display font-extrabold text-sm">
        <span className="absolute inset-0.5 rounded-full border-2 border-dashed border-white/40 logo-ring" />
        360
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-cream' : 'text-ink'}`}>
        Eatery
      </span>
    </Link>
  )
}

export function Header() {
  const { cart } = useStore()
  const count = cart.reduce((s, l) => s + l.quantity, 0)
  const path = useRouterState({ select: (s) => s.location.pathname })
  const isAdmin = path.startsWith('/admin')

  const navLink = 'px-3 py-2 rounded-full text-sm font-semibold hover:bg-ink/5 transition'
  const active = '!bg-ink text-cream'

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Logo />
        <nav className="flex items-center gap-1">
          {isAdmin ? (
            <>
              <Link to="/admin" activeOptions={{ exact: true }} className={navLink} activeProps={{ className: active }}>
                Orders & Sales
              </Link>
              <Link to="/admin/menu" className={navLink} activeProps={{ className: active }}>
                Menu & Inventory
              </Link>
              <Link to="/" className={`${navLink} hidden sm:inline-flex`}>
                View storefront
              </Link>
            </>
          ) : (
            <>
              <Link to="/menu" className={`${navLink} hidden sm:inline-flex`} activeProps={{ className: active }}>
                Menu
              </Link>
              <Link to="/orders" className={navLink} activeProps={{ className: active }}>
                <Receipt className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">My orders</span>
              </Link>
              <Link to="/cart" className="btn btn-ember !py-2 !px-4 text-sm ml-1">
                <ShoppingBag className="h-4 w-4" />
                Cart
                {count > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs text-ember">
                    {count}
                  </span>
                )}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm">{restaurant.tagline} Freshly cooked, ready for pickup or delivered to your door.</p>
        </div>
        <div className="text-sm space-y-1">
          <p className="font-bold text-cream">Visit us</p>
          <p>{restaurant.address}</p>
          <p>{restaurant.hours}</p>
          <p>{restaurant.phone}</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-bold text-cream">Staff</p>
          <Link to="/admin" className="inline-flex items-center gap-2 hover:text-saffron">
            <ChefHat className="h-4 w-4" /> Kitchen dashboard
          </Link>
        </div>
      </div>
      <p className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} 360 Eatery. All rights reserved.
      </p>
    </footer>
  )
}

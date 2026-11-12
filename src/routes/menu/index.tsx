import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { z } from 'zod'
import { FoodCard } from '@/components/FoodCard'
import { categories } from '@/data/fixtures'
import { useStore } from '@/lib/store'

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.enum(categories as [string, ...Array<string>]).optional(),
})

export const Route = createFileRoute('/menu/')({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: 'Menu — 360 Eatery' }] }),
  component: MenuPage,
})

function MenuPage() {
  const { q = '', category } = Route.useSearch()
  const navigate = useNavigate({ from: '/menu/' })
  const { menu } = useStore()

  const term = q.trim().toLowerCase()
  const results = menu.filter(
    (f) =>
      (!category || f.category === category) &&
      (!term || `${f.name} ${f.shortDescription} ${f.category}`.toLowerCase().includes(term)),
  )

  const setSearch = (next: { q?: string; category?: string }) =>
    navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="font-display text-5xl font-extrabold">Our menu</h1>
      <p className="mt-2 text-ink/60">Freshly cooked to order. Tap a dish for details and extras.</p>

      <div className="sticky top-16 z-30 -mx-5 mt-8 bg-cream/90 px-5 py-4 backdrop-blur-md">
        <label className="relative block max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setSearch({ q: e.target.value || undefined })}
            placeholder="Search jollof, tuwo, pepper soup…"
            className="field !rounded-full !pl-12 !py-3.5"
          />
          {q && (
            <button
              onClick={() => setSearch({ q: undefined })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/50"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {[undefined, ...categories].map((c) => (
            <button
              key={c ?? 'all'}
              onClick={() => setSearch({ category: c })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                category === c ? 'bg-ink text-cream' : 'bg-white text-ink/70 hover:text-ink'
              }`}
            >
              {c ?? 'All dishes'}
            </button>
          ))}
        </div>
      </div>

      {results.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((food, i) => (
            <FoodCard key={food.id} food={food} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-3xl border-2 border-dashed border-ink/15 p-14 text-center">
          <p className="font-display text-2xl font-bold">Nothing matches “{q}”</p>
          <p className="mt-2 text-ink/60">Try another dish name or browse all categories.</p>
          <button onClick={() => setSearch({ q: undefined, category: undefined })} className="btn btn-ember mt-6">
            Show all dishes
          </button>
        </div>
      )}
    </div>
  )
}

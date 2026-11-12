import { Link } from '@tanstack/react-router'
import { Flame, Plus } from 'lucide-react'
import { type FoodItem, cdn, naira } from '@/data/fixtures'
import { useStore } from '@/lib/store'

export function FoodCard({ food, index = 0 }: { food: FoodItem; index?: number }) {
  const { addToCart } = useStore()
  const soldOut = !food.available || food.stock === 0

  return (
    <article
      className="rise group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_0_rgba(23,18,15,0.06),0_18px_40px_-28px_rgba(23,18,15,0.45)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link to="/menu/$foodId" params={{ foodId: food.id }} className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={cdn(food.image, 640)}
          alt={food.name}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${soldOut ? 'grayscale' : ''}`}
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {food.popular && <span className="rounded-full bg-saffron px-2.5 py-1 text-xs font-bold text-ink">Popular</span>}
          {food.spicy && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-bold text-white">
              <Flame className="h-3 w-3 text-ember" /> Spicy
            </span>
          )}
        </div>
        {soldOut && (
          <span className="absolute inset-0 grid place-items-center bg-ink/40 font-display text-2xl font-bold text-white">
            Sold out
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-ember">{food.category}</p>
        <Link to="/menu/$foodId" params={{ foodId: food.id }}>
          <h3 className="mt-1 font-display text-xl font-bold leading-tight hover:text-ember">{food.name}</h3>
        </Link>
        <p className="mt-2 flex-1 text-sm text-ink/65">{food.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold">{naira(food.price)}</span>
          <button
            onClick={() => addToCart(food.id, 1, [])}
            disabled={soldOut}
            aria-label={`Add ${food.name} to cart`}
            className="btn btn-ember !h-10 !w-10 !p-0"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  )
}

import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Check, Clock, Flame, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { FoodCard } from '@/components/FoodCard'
import { type FoodItem, cdn, getFood, naira } from '@/data/fixtures'
import { useStore } from '@/lib/store'

export const Route = createFileRoute('/menu/$foodId')({
  // Dishes added from the admin screen only exist client-side, so the lookup happens in the component.
  loader: ({ params }) => ({ id: params.foodId, name: getFood(params.foodId)?.name }),
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? 'Dish'} — 360 Eatery` }] }),
  component: FoodPage,
})

function FoodPage() {
  const { id } = Route.useLoaderData()
  const { menu } = useStore()
  const food = menu.find((f) => f.id === id)
  if (!food) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Dish not found</h1>
        <Link to="/menu" className="btn btn-ember mt-6">
          Back to menu
        </Link>
      </div>
    )
  }
  return <FoodDetails key={food.id} food={food} />
}

function FoodDetails({ food }: { food: FoodItem }) {
  const { menu, addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [extras, setExtras] = useState<Array<string>>([])
  const [added, setAdded] = useState(false)

  const soldOut = !food.available || food.stock === 0
  const unit = food.price + food.extras.filter((e) => extras.includes(e.id)).reduce((s, e) => s + e.price, 0)
  const related = menu.filter((f) => f.category === food.category && f.id !== food.id).slice(0, 3)

  const toggle = (extraId: string) =>
    setExtras((prev) => (prev.includes(extraId) ? prev.filter((x) => x !== extraId) : [...prev, extraId]))

  const add = () => {
    addToCart(food.id, quantity, extras)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-ember">
        <ArrowLeft className="h-4 w-4" /> Back to menu
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="rise overflow-hidden rounded-[2rem]">
          <img src={cdn(food.image, 1200)} alt={food.name} className="aspect-[4/3] h-full w-full object-cover" />
        </div>

        <div className="rise" style={{ animationDelay: '100ms' }}>
          <p className="text-sm font-bold uppercase tracking-widest text-ember">{food.category}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight md:text-5xl">{food.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5">
              <Clock className="h-4 w-4" /> ~{food.prepMinutes} min
            </span>
            {food.spicy && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5">
                <Flame className="h-4 w-4 text-ember" /> Spicy
              </span>
            )}
            {!soldOut && food.stock <= 5 && (
              <span className="rounded-full bg-saffron/30 px-3 py-1.5">Only {food.stock} left today</span>
            )}
          </div>
          <p className="mt-6 text-lg leading-relaxed text-ink/75">{food.description}</p>

          {food.extras.length > 0 && (
            <fieldset className="mt-8">
              <legend className="font-bold">Add extras</legend>
              <div className="mt-3 space-y-2">
                {food.extras.map((extra) => {
                  const on = extras.includes(extra.id)
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggle(extra.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition ${
                        on ? 'border-ember bg-ember/5' : 'border-ink/10 bg-white hover:border-ink/25'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-md border-2 ${on ? 'border-ember bg-ember text-white' : 'border-ink/25'}`}
                        >
                          {on && <Check className="h-3.5 w-3.5" />}
                        </span>
                        {extra.name}
                      </span>
                      <span className="font-semibold text-ink/70">+{naira(extra.price)}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-8">
            <div className="flex items-center rounded-full bg-white p-1 shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-lg font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(food.stock || 1, q + 1))}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={add} disabled={soldOut} className="btn btn-ember flex-1 text-lg">
              {soldOut ? 'Sold out today' : added ? (
                <>
                  <Check className="h-5 w-5" /> Added to cart
                </>
              ) : (
                <>Add to cart · {naira(unit * quantity)}</>
              )}
            </button>
          </div>
          {added && (
            <Link to="/cart" className="mt-3 inline-block text-sm font-bold text-ember underline">
              View cart & checkout →
            </Link>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl font-bold">More {food.category.toLowerCase()}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((f, i) => (
              <FoodCard key={f.id} food={f} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

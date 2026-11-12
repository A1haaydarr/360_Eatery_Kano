import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { cdn, naira } from '@/data/fixtures'
import { cartTotals, lineTotal, useStore } from '@/lib/store'

export const Route = createFileRoute('/cart')({
  head: () => ({ meta: [{ title: 'Your cart — 360 Eatery' }] }),
  component: CartPage,
})

function CartPage() {
  const { cart, menu, setQuantity, clearCart } = useStore()
  const { subtotal } = cartTotals(cart, menu, 'pickup')

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sand">
          <ShoppingBag className="h-9 w-9 text-ember" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Add a few dishes from the menu to get started.</p>
        <Link to="/menu" className="btn btn-ember mt-8">
          Browse the menu
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-5xl font-extrabold">Your cart</h1>
        <button onClick={clearCart} className="text-sm font-bold text-ink/50 hover:text-ember">
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-4">
          {cart.map((line) => {
            const food = menu.find((f) => f.id === line.foodId)
            if (!food) return null
            const extras = food.extras.filter((e) => line.extraIds.includes(e.id))
            return (
              <li key={line.key} className="rise flex gap-4 rounded-3xl bg-white p-4">
                <img src={cdn(food.image, 240)} alt={food.name} className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <Link to="/menu/$foodId" params={{ foodId: food.id }} className="font-display text-lg font-bold hover:text-ember">
                      {food.name}
                    </Link>
                    <span className="font-bold">{naira(lineTotal(line, menu))}</span>
                  </div>
                  {extras.length > 0 && <p className="text-sm text-ink/60">+ {extras.map((e) => e.name).join(', ')}</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full bg-cream">
                      <button
                        onClick={() => setQuantity(line.key, line.quantity - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold">{line.quantity}</span>
                      <button
                        onClick={() => setQuantity(line.key, line.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => setQuantity(line.key, 0)}
                      className="text-ink/40 hover:text-ember"
                      aria-label={`Remove ${food.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="h-fit rounded-3xl bg-ink p-6 text-cream lg:sticky lg:top-24">
          <p className="font-display text-2xl font-bold">Summary</p>
          <div className="mt-5 flex justify-between text-cream/80">
            <span>Subtotal</span>
            <span>{naira(subtotal)}</span>
          </div>
          <p className="mt-2 text-sm text-cream/50">Delivery and service fees are added at checkout.</p>
          <Link to="/checkout" className="btn btn-ember mt-6 w-full">
            Checkout <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/menu" className="mt-3 block text-center text-sm font-semibold text-cream/60 hover:text-cream">
            Add more dishes
          </Link>
        </aside>
      </div>
    </div>
  )
}

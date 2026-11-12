import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Banknote, Bike, CreditCard, Landmark, Loader2, Lock, Store } from 'lucide-react'
import { useState } from 'react'
import { type FulfilmentType, naira, restaurant } from '@/data/fixtures'
import { type CheckoutDetails, cartTotals, useStore } from '@/lib/store'

export const Route = createFileRoute('/checkout')({
  head: () => ({ meta: [{ title: 'Checkout — 360 Eatery' }] }),
  component: Checkout,
})

const paymentOptions: Array<{ id: CheckoutDetails['paymentMethod']; label: string; hint: string; icon: typeof CreditCard }> = [
  { id: 'card', label: 'Pay with card', hint: 'Visa, Mastercard, Verve', icon: CreditCard },
  { id: 'transfer', label: 'Bank transfer', hint: 'Pay into our account', icon: Landmark },
  { id: 'cash', label: 'Pay on arrival', hint: 'Cash or POS at hand-off', icon: Banknote },
]

function Checkout() {
  const { cart, menu, placeOrder } = useStore()
  const navigate = useNavigate()
  const [type, setType] = useState<FulfilmentType>('pickup')
  const [payment, setPayment] = useState<CheckoutDetails['paymentMethod']>('card')
  const [processing, setProcessing] = useState(false)
  const totals = cartTotals(cart, menu, type)

  if (!cart.length && !processing) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Nothing to check out</h1>
        <Link to="/menu" className="btn btn-ember mt-6">
          Browse the menu
        </Link>
      </div>
    )
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setProcessing(true)
    // Payment is simulated in this milestone; a payment gateway is wired up in a later milestone (see PLAN.md).
    await new Promise((r) => setTimeout(r, payment === 'cash' ? 500 : 1600))
    const order = placeOrder({
      customerName: String(form.get('name')),
      phone: String(form.get('phone')),
      type,
      address: type === 'delivery' ? String(form.get('address')) : undefined,
      notes: String(form.get('notes') || '') || undefined,
      paymentMethod: payment,
    })
    navigate({ to: '/orders/$orderId', params: { orderId: order.id } })
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <h1 className="font-display text-5xl font-extrabold">Checkout</h1>

        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-display text-2xl font-bold">1. How would you like it?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { id: 'pickup' as const, label: 'Pickup', hint: `Collect at ${restaurant.name}`, icon: Store, fee: 'Free' },
              { id: 'delivery' as const, label: 'Delivery', hint: 'Brought to your address', icon: Bike, fee: naira(restaurant.deliveryFee) },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setType(opt.id)}
                className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                  type === opt.id ? 'border-ember bg-ember/5' : 'border-ink/10 hover:border-ink/25'
                }`}
              >
                <opt.icon className={`mt-0.5 h-6 w-6 ${type === opt.id ? 'text-ember' : 'text-ink/50'}`} />
                <span className="flex-1">
                  <span className="flex justify-between font-bold">
                    {opt.label} <span className="text-sm text-ink/60">{opt.fee}</span>
                  </span>
                  <span className="text-sm text-ink/60">{opt.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-display text-2xl font-bold">2. Your details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Full name
              <input name="name" required className="field mt-1.5" placeholder="e.g. Amina Bello" />
            </label>
            <label className="text-sm font-semibold">
              Phone number
              <input name="phone" required type="tel" className="field mt-1.5" placeholder="0803 000 0000" />
            </label>
            {type === 'delivery' && (
              <label className="text-sm font-semibold sm:col-span-2">
                Delivery address
                <textarea name="address" required rows={2} className="field mt-1.5" placeholder="House number, street, area, landmark" />
              </label>
            )}
            <label className="text-sm font-semibold sm:col-span-2">
              Notes for the kitchen <span className="font-normal text-ink/50">(optional)</span>
              <input name="notes" className="field mt-1.5" placeholder="Less pepper, no onions…" />
            </label>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-display text-2xl font-bold">3. Payment</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {paymentOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPayment(opt.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  payment === opt.id ? 'border-ember bg-ember/5' : 'border-ink/10 hover:border-ink/25'
                }`}
              >
                <opt.icon className={`h-6 w-6 ${payment === opt.id ? 'text-ember' : 'text-ink/50'}`} />
                <p className="mt-2 font-bold">{opt.label}</p>
                <p className="text-xs text-ink/60">{opt.hint}</p>
              </button>
            ))}
          </div>
          {payment === 'card' && (
            <div className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
              <input required className="field" inputMode="numeric" placeholder="Card number" defaultValue="4084 0840 8408 4081" />
              <input required className="field" placeholder="MM/YY" defaultValue="12/29" />
              <input required className="field" placeholder="CVV" defaultValue="408" />
              <p className="flex items-center gap-1.5 text-xs text-ink/50 sm:col-span-3">
                <Lock className="h-3.5 w-3.5" /> Demo card details — no real charge is made yet.
              </p>
            </div>
          )}
        </section>
      </div>

      <aside className="h-fit rounded-3xl bg-ink p-6 text-cream lg:sticky lg:top-24 lg:mt-[4.5rem]">
        <p className="font-display text-2xl font-bold">Order summary</p>
        <ul className="mt-4 space-y-2 border-b border-cream/10 pb-4 text-sm">
          {cart.map((l) => {
            const food = menu.find((f) => f.id === l.foodId)
            return (
              <li key={l.key} className="flex justify-between gap-3">
                <span className="text-cream/80">
                  {l.quantity}× {food?.name}
                </span>
              </li>
            )
          })}
        </ul>
        <dl className="mt-4 space-y-2 text-sm text-cream/80">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{naira(totals.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{totals.delivery ? naira(totals.delivery) : 'Free'}</dd></div>
          <div className="flex justify-between"><dt>Service fee</dt><dd>{naira(totals.service)}</dd></div>
          <div className="flex justify-between border-t border-cream/10 pt-3 text-lg font-bold text-cream">
            <dt>Total</dt><dd>{naira(totals.total)}</dd>
          </div>
        </dl>
        <button type="submit" disabled={processing} className="btn btn-ember mt-6 w-full text-lg">
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> {payment === 'cash' ? 'Placing order…' : 'Processing payment…'}
            </>
          ) : payment === 'cash' ? (
            `Place order · ${naira(totals.total)}`
          ) : (
            `Pay ${naira(totals.total)}`
          )}
        </button>
      </aside>
    </form>
  )
}

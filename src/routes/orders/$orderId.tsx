import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Bike, MapPin, Phone, Store } from 'lucide-react'
import { naira, restaurant } from '@/data/fixtures'
import { StatusBadge, StatusTracker } from '@/components/OrderStatus'
import { useStore } from '@/lib/store'

export const Route = createFileRoute('/orders/$orderId')({
  head: ({ params }) => ({ meta: [{ title: `Order #${params.orderId} — 360 Eatery` }] }),
  component: TrackOrder,
})

function TrackOrder() {
  const { orderId } = Route.useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Order not found</h1>
        <p className="mt-2 text-ink/60">Check your order number and try again.</p>
        <Link to="/orders" className="btn btn-ember mt-6">
          My orders
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-ember">
        <ArrowLeft className="h-4 w-4" /> My orders
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Order #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-ink/60">
        Placed {new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })} · Updates
        appear here automatically as the kitchen moves your order along.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rise rounded-3xl bg-white p-7">
          <h2 className="font-display text-2xl font-bold">Order progress</h2>
          {order.status === 'cancelled' ? (
            <p className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
              This order was cancelled. Call us on {restaurant.phone} if you have questions.
            </p>
          ) : (
            <StatusTracker status={order.status} type={order.type} />
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-ink p-6 text-cream">
            <p className="flex items-center gap-2 font-bold">
              {order.type === 'delivery' ? <Bike className="h-5 w-5 text-saffron" /> : <Store className="h-5 w-5 text-saffron" />}
              {order.type === 'delivery' ? 'Delivery to' : 'Pickup at'}
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-cream/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {order.type === 'delivery' ? order.address : restaurant.address}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-cream/80">
              <Phone className="h-4 w-4" /> {restaurant.phone}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6">
            <p className="font-bold">Items</p>
            <ul className="mt-3 space-y-2 text-sm">
              {order.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>
                    {l.quantity}× {l.name}
                    {l.extras.length > 0 && <span className="block text-ink/50">+ {l.extras.join(', ')}</span>}
                  </span>
                  <span className="font-semibold">{naira(l.unitPrice * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-ink/10 pt-3 font-bold">
              <span>Total (incl. fees)</span>
              <span>{naira(order.total)}</span>
            </div>
            <p className="mt-2 text-xs text-ink/50">
              {order.paymentMethod === 'cash'
                ? order.paid
                  ? 'Paid on arrival'
                  : 'Pay on arrival (cash or POS)'
                : `Paid by ${order.paymentMethod === 'card' ? 'card' : 'bank transfer'}`}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

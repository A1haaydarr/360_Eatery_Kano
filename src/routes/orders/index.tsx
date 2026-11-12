import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Receipt } from 'lucide-react'
import { naira } from '@/data/fixtures'
import { StatusBadge } from '@/components/OrderStatus'
import { useStore } from '@/lib/store'

export const Route = createFileRoute('/orders/')({
  head: () => ({ meta: [{ title: 'My orders — 360 Eatery' }] }),
  component: OrderHistory,
})

function OrderHistory() {
  const { orders, myOrderIds } = useStore()
  const mine = orders.filter((o) => myOrderIds.includes(o.id))
  const active = mine.filter((o) => !['completed', 'cancelled'].includes(o.status))
  const past = mine.filter((o) => ['completed', 'cancelled'].includes(o.status))

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-5xl font-extrabold">My orders</h1>

      {!mine.length ? (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center">
          <Receipt className="mx-auto h-10 w-10 text-ember" />
          <p className="mt-4 font-display text-2xl font-bold">No orders yet</p>
          <p className="mt-1 text-ink/60">Once you place an order, you can track it and find it here.</p>
          <Link to="/menu" className="btn btn-ember mt-6">
            Order something delicious
          </Link>
        </div>
      ) : (
        <>
          {active.length > 0 && <OrderList title="In progress" orders={active} />}
          {past.length > 0 && <OrderList title="Past orders" orders={past} />}
        </>
      )}
    </div>
  )
}

function OrderList({ title, orders }: { title: string; orders: ReturnType<typeof useStore>['orders'] }) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-bold uppercase tracking-widest text-ink/50">{title}</h2>
      <ul className="mt-3 space-y-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link
              to="/orders/$orderId"
              params={{ orderId: o.id }}
              className="flex items-center gap-4 rounded-3xl bg-white p-5 transition hover:shadow-lg"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-lg font-bold">#{o.id}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 text-sm text-ink/60">
                  {new Date(o.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
                  {o.type === 'delivery' ? 'Delivery' : 'Pickup'} · {o.lines.reduce((s, l) => s + l.quantity, 0)} items
                </p>
              </div>
              <span className="font-bold">{naira(o.total)}</span>
              <ChevronRight className="h-5 w-5 text-ink/30" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

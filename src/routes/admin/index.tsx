import { Link, createFileRoute } from '@tanstack/react-router'
import { Bike, ChevronRight, Clock, Store, X } from 'lucide-react'
import { type Order, type OrderStatus, naira, statusFlow, statusLabels, weeklySales } from '@/data/fixtures'
import { StatusBadge } from '@/components/OrderStatus'
import { useStore } from '@/lib/store'

export const Route = createFileRoute('/admin/')({
  head: () => ({ meta: [{ title: 'Kitchen dashboard — 360 Eatery' }] }),
  component: AdminDashboard,
})

const columns: Array<{ title: string; statuses: Array<OrderStatus> }> = [
  { title: 'New', statuses: ['placed'] },
  { title: 'In the kitchen', statuses: ['confirmed', 'preparing'] },
  { title: 'Ready / On the way', statuses: ['ready', 'out_for_delivery'] },
]

function nextStatus(order: Order): OrderStatus | null {
  const flow = statusFlow(order.type)
  const i = flow.indexOf(order.status)
  return i >= 0 && i < flow.length - 1 ? flow[i + 1] : null
}

const actionLabels: Partial<Record<OrderStatus, string>> = {
  confirmed: 'Accept order',
  preparing: 'Start cooking',
  ready: 'Mark ready',
  out_for_delivery: 'Send out',
  completed: 'Complete',
}

function AdminDashboard() {
  const { orders, menu } = useStore()
  const today = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString())
  const revenueToday = today.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const open = orders.filter((o) => !['completed', 'cancelled'].includes(o.status))
  const lowStock = menu.filter((f) => f.stock <= 5)
  const maxRevenue = Math.max(...weeklySales.map((d) => d.revenue))
  const weekTotal = weeklySales.reduce((s, d) => s + d.revenue, 0)
  const weekOrders = weeklySales.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-ember">Restaurant admin</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold">Orders & sales</h1>
        </div>
        <p className="text-sm text-ink/50">Preview mode · staff sign-in arrives with accounts</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Revenue today" value={naira(revenueToday)} />
        <Kpi label="Orders today" value={String(today.length)} />
        <Kpi label="Open orders" value={String(open.length)} accent />
        <Kpi label="Low-stock items" value={String(lowStock.length)} link />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Live orders</h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-3">
          {columns.map((col) => {
            const list = open.filter((o) => col.statuses.includes(o.status))
            return (
              <div key={col.title} className="rounded-3xl bg-sand/60 p-4">
                <p className="flex items-center justify-between px-1 font-bold">
                  {col.title}
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-xs text-cream">{list.length}</span>
                </p>
                <div className="mt-3 space-y-3">
                  {list.length === 0 && <p className="rounded-2xl border-2 border-dashed border-ink/10 p-6 text-center text-sm text-ink/40">No orders</p>}
                  {list.map((o) => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-2xl font-bold">Sales — last 7 days</h2>
            <p className="text-sm text-ink/60">
              <span className="font-bold text-ink">{naira(weekTotal)}</span> from {weekOrders} orders
            </p>
          </div>
          <div className="mt-6 flex h-56 items-end gap-3" role="img" aria-label="Daily revenue for the last seven days">
            {weeklySales.map((d, i) => (
              <div key={d.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-bold text-ink/0 transition group-hover:text-ink/70">{naira(d.revenue)}</span>
                <div
                  className={`w-full max-w-14 rounded-t-xl transition ${i === weeklySales.length - 1 ? 'bg-ember' : 'bg-ember/35 group-hover:bg-ember/60'}`}
                  style={{ height: `${(d.revenue / maxRevenue) * 80}%` }}
                />
                <span className="text-xs font-semibold text-ink/60">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-display text-2xl font-bold">Recently completed</h2>
          <ul className="mt-4 divide-y divide-ink/5">
            {orders
              .filter((o) => ['completed', 'cancelled'].includes(o.status))
              .slice(0, 6)
              .map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                  <span>
                    <span className="font-bold">#{o.id}</span> · {o.customerName}
                  </span>
                  <span className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    <span className="font-semibold">{naira(o.total)}</span>
                  </span>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Kpi({ label, value, accent, link }: { label: string; value: string; accent?: boolean; link?: boolean }) {
  const body = (
    <>
      <p className={`text-sm font-semibold ${accent ? 'text-cream/70' : 'text-ink/55'}`}>{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </>
  )
  const cls = `rounded-3xl p-5 ${accent ? 'bg-ink text-cream' : 'bg-white'}`
  return link ? (
    <Link to="/admin/menu" className={`${cls} transition hover:shadow-lg`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}

function OrderCard({ order }: { order: Order }) {
  const { updateOrderStatus } = useStore()
  const next = nextStatus(order)
  const mins = Math.max(0, Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000))

  return (
    <article className="rise rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-lg font-bold">#{order.id}</p>
          <p className="text-sm text-ink/60">{order.customerName}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-ink/55">
        <span className="inline-flex items-center gap-1">
          {order.type === 'delivery' ? <Bike className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
          {order.type === 'delivery' ? 'Delivery' : 'Pickup'}
        </span>
        <span className="inline-flex items-center gap-1" suppressHydrationWarning>
          <Clock className="h-3.5 w-3.5" /> {mins < 60 ? `${mins} min ago` : `${Math.floor(mins / 60)}h ago`}
        </span>
        <span>{order.paid ? 'Paid' : 'Unpaid'}</span>
      </div>
      <ul className="mt-3 space-y-0.5 border-t border-ink/5 pt-3 text-sm">
        {order.lines.map((l, i) => (
          <li key={i}>
            <span className="font-bold">{l.quantity}×</span> {l.name}
            {l.extras.length > 0 && <span className="text-ink/50"> + {l.extras.join(', ')}</span>}
          </li>
        ))}
      </ul>
      {order.notes && <p className="mt-2 rounded-xl bg-saffron/15 px-3 py-2 text-xs">“{order.notes}”</p>}
      <div className="mt-4 flex gap-2">
        {next && (
          <button onClick={() => updateOrderStatus(order.id, next)} className="btn btn-ember flex-1 !py-2 text-sm">
            {actionLabels[next] ?? statusLabels[next]} <ChevronRight className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => updateOrderStatus(order.id, 'cancelled')}
          className="btn !px-3 !py-2 text-ink/50 hover:bg-red-50 hover:text-red-700"
          aria-label={`Cancel order ${order.id}`}
          title="Cancel order"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

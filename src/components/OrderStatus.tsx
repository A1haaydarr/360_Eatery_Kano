import { Check } from 'lucide-react'
import { type FulfilmentType, type OrderStatus, statusFlow, statusLabels } from '@/data/fixtures'

const badgeColors: Record<OrderStatus, string> = {
  placed: 'bg-saffron/25 text-ink',
  confirmed: 'bg-sky-100 text-sky-900',
  preparing: 'bg-ember/15 text-ember-dark',
  ready: 'bg-leaf/15 text-leaf',
  out_for_delivery: 'bg-violet-100 text-violet-900',
  completed: 'bg-ink/10 text-ink/70',
  cancelled: 'bg-red-100 text-red-800',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeColors[status]}`}>{statusLabels[status]}</span>
  )
}

export function StatusTracker({ status, type }: { status: OrderStatus; type: FulfilmentType }) {
  const steps = statusFlow(type)
  const current = steps.indexOf(status)

  return (
    <ol className="relative mt-6 space-y-0">
      {steps.map((step, i) => {
        const done = i < current || status === 'completed'
        const now = i === current && status !== 'completed'
        return (
          <li key={step} className="relative flex gap-4 pb-7 last:pb-0">
            {i < steps.length - 1 && (
              <span className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${done ? 'bg-ember' : 'bg-ink/10'}`} />
            )}
            <span
              className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${
                done ? 'border-ember bg-ember text-white' : now ? 'border-ember bg-white' : 'border-ink/15 bg-white'
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : now && <span className="h-3 w-3 animate-ping rounded-full bg-ember" />}
            </span>
            <div className="pt-1">
              <p className={`font-bold ${!done && !now ? 'text-ink/40' : ''}`}>
                {step === 'completed' ? (type === 'delivery' ? 'Delivered' : 'Picked up') : statusLabels[step]}
              </p>
              {now && <p className="text-sm text-ink/60">{stepHint(step, type)}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function stepHint(step: OrderStatus, type: FulfilmentType) {
  switch (step) {
    case 'placed':
      return 'Waiting for the kitchen to accept your order.'
    case 'confirmed':
      return 'The kitchen has accepted your order.'
    case 'preparing':
      return 'Your food is being cooked fresh.'
    case 'ready':
      return type === 'pickup' ? 'Come to the counter and give your order number.' : 'Packed and waiting for the rider.'
    case 'out_for_delivery':
      return 'Your rider is on the way.'
    default:
      return ''
  }
}

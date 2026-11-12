import { createFileRoute } from '@tanstack/react-router'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { type Category, type FoodItem, categories, cdn, images, naira } from '@/data/fixtures'
import { useStore } from '@/lib/store'

export const Route = createFileRoute('/admin/menu')({
  head: () => ({ meta: [{ title: 'Menu & inventory — 360 Eatery' }] }),
  component: AdminMenu,
})

const blankFood = (): FoodItem => ({
  id: '',
  name: '',
  category: 'Rice Dishes',
  price: 0,
  image: images.jollof,
  shortDescription: '',
  description: '',
  prepMinutes: 15,
  available: true,
  stock: 20,
  extras: [],
})

function AdminMenu() {
  const { menu, saveFood, removeFood } = useStore()
  const [editing, setEditing] = useState<FoodItem | null>(null)
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const rows = menu.filter((f) => filter === 'all' || f.category === filter)

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-ember">Restaurant admin</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold">Menu & inventory</h1>
        </div>
        <button onClick={() => setEditing(blankFood())} className="btn btn-ember">
          <Plus className="h-5 w-5" /> Add food
        </button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {(['all', ...categories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${filter === c ? 'bg-ink text-cream' : 'bg-white text-ink/70'}`}
          >
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="px-5 py-4">Dish</th>
              <th className="px-3 py-4">Price</th>
              <th className="px-3 py-4">Stock today</th>
              <th className="px-3 py-4">On menu</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {rows.map((f) => (
              <tr key={f.id} className={f.available ? '' : 'bg-cream/60'}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={cdn(f.image, 120)} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold">{f.name}</p>
                      <p className="text-xs text-ink/50">{f.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 font-semibold">{naira(f.price)}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={f.stock}
                      onChange={(e) => saveFood({ ...f, stock: Math.max(0, Number(e.target.value)) })}
                      className="field !w-20 !rounded-lg !px-2 !py-1.5"
                      aria-label={`Stock for ${f.name}`}
                    />
                    {f.stock === 0 ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">Out</span>
                    ) : f.stock <= 5 ? (
                      <span className="rounded-full bg-saffron/30 px-2 py-0.5 text-xs font-bold">Low</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <button
                    role="switch"
                    aria-checked={f.available}
                    aria-label={`${f.name} available`}
                    onClick={() => saveFood({ ...f, available: !f.available })}
                    className={`relative h-6 w-11 rounded-full transition ${f.available ? 'bg-leaf' : 'bg-ink/20'}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${f.available ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setEditing(f)} className="rounded-lg p-2 text-ink/60 hover:bg-sand hover:text-ink" aria-label={`Edit ${f.name}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => confirm(`Remove ${f.name} from the menu?`) && removeFood(f.id)}
                    className="rounded-lg p-2 text-ink/60 hover:bg-red-50 hover:text-red-700"
                    aria-label={`Remove ${f.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <FoodEditor
          food={editing}
          onClose={() => setEditing(null)}
          onSave={(item) => {
            saveFood(item)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

function FoodEditor({ food, onClose, onSave }: { food: FoodItem; onClose: () => void; onSave: (f: FoodItem) => void }) {
  const isNew = !food.id
  const [draft, setDraft] = useState(food)
  const set = <K extends keyof FoodItem>(key: K, value: FoodItem[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = draft.id || `${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`
    onSave({ ...draft, id, description: draft.description || draft.shortDescription })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="rise max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-7"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{isNew ? 'Add food' : `Edit ${food.name}`}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            Name
            <input required value={draft.name} onChange={(e) => set('name', e.target.value)} className="field mt-1.5" />
          </label>
          <label className="text-sm font-semibold">
            Category
            <select value={draft.category} onChange={(e) => set('category', e.target.value as Category)} className="field mt-1.5">
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Price (₦)
            <input
              required
              type="number"
              min={0}
              step={50}
              value={draft.price || ''}
              onChange={(e) => set('price', Number(e.target.value))}
              className="field mt-1.5"
            />
          </label>
          <label className="text-sm font-semibold">
            Prep time (min)
            <input type="number" min={1} value={draft.prepMinutes} onChange={(e) => set('prepMinutes', Number(e.target.value))} className="field mt-1.5" />
          </label>
          <label className="text-sm font-semibold">
            Stock today
            <input type="number" min={0} value={draft.stock} onChange={(e) => set('stock', Number(e.target.value))} className="field mt-1.5" />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Short description
            <input required value={draft.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} className="field mt-1.5" />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Full description
            <textarea rows={3} value={draft.description} onChange={(e) => set('description', e.target.value)} className="field mt-1.5" />
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-semibold">Photo</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {Object.entries(images)
                .filter(([k]) => k !== 'hero')
                .map(([k, file]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => set('image', file)}
                    className={`overflow-hidden rounded-xl border-2 ${draft.image === file ? 'border-ember' : 'border-transparent'}`}
                  >
                    <img src={cdn(file, 120)} alt={k} className="h-14 w-14 object-cover" />
                  </button>
                ))}
            </div>
            <p className="mt-1 text-xs text-ink/50">Photo uploads arrive with the database milestone.</p>
          </fieldset>
          <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
            <input type="checkbox" checked={draft.available} onChange={(e) => set('available', e.target.checked)} className="h-4 w-4 accent-ember" />
            Available to order
          </label>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn btn-ember">
            {isNew ? 'Add to menu' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

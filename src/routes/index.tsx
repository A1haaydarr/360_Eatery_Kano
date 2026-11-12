import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Bike, ChefHat, Clock, ShoppingBag, Store } from 'lucide-react'
import { FoodCard } from '@/components/FoodCard'
import { categories, cdn, images, restaurant } from '@/data/fixtures'
import { useStore } from '@/lib/store'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { menu } = useStore()
  const popular = menu.filter((f) => f.popular).slice(0, 4)

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-cream">
        <img
          src={cdn(images.hero, 1800)}
          alt="A spread of rice dishes and soups at 360 Eatery Kano"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:py-36">
          <p className="rise inline-flex items-center gap-2 rounded-full border border-cream/25 px-4 py-1.5 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-leaf animate-pulse" /> Kitchen open · {restaurant.hours.split('·')[1]}
          </p>
          <h1 className="rise mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] md:text-7xl" style={{ animationDelay: '80ms' }}>
            Every flavour,
            <br />
            <span className="text-saffron italic">full circle.</span>
          </h1>
          <p className="rise mt-6 max-w-xl text-lg text-cream/80" style={{ animationDelay: '160ms' }}>
            Jollof and fried rice, tuwo and sakwara, ram pepper soup, masar Bauchi and kunu — order from 360 Eatery
            Kano in Dorayi, then pick it up hot or have it delivered to your door.
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
            <Link to="/menu" className="btn btn-ember text-lg">
              Order now <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/orders" className="btn btn-ghost text-cream">
              Track an order
            </Link>
          </div>
        </div>
      </section>

      <section className="grain border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl gap-px bg-ink/10 md:grid-cols-4">
          {[
            { icon: ShoppingBag, title: 'Pick your dishes', text: 'Browse the full menu and customise with extras.' },
            { icon: Store, title: 'Pickup or delivery', text: 'Collect at the counter or get it delivered.' },
            { icon: ChefHat, title: 'Cooked fresh', text: 'Every order is prepared when you place it.' },
            { icon: Clock, title: 'Track it live', text: 'Follow your order from kitchen to hand-off.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-cream p-7">
              <Icon className="h-6 w-6 text-ember" />
              <p className="mt-3 font-bold">{title}</p>
              <p className="mt-1 text-sm text-ink/60">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-ember">Crowd favourites</p>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">What everyone's ordering</h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-1 font-bold text-ember hover:gap-2 transition-all">
            See full menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((food, i) => (
            <FoodCard key={food.id} food={food} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <h2 className="font-display text-3xl font-bold">Browse by category</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              to="/menu"
              search={{ category: c }}
              className="rounded-full border-2 border-ink/10 bg-white px-5 py-3 font-semibold hover:border-ember hover:text-ember transition"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <div className="grid overflow-hidden rounded-[2rem] bg-ember text-white md:grid-cols-2">
          <div className="p-10 md:p-14">
            <h2 className="font-display text-4xl font-bold leading-tight">Hungry now? Skip the queue.</h2>
            <p className="mt-4 text-white/85">
              Order ahead for pickup and your food is waiting at the counter — or choose delivery and we'll bring it to
              you.
            </p>
            <Link to="/menu" className="btn mt-8 bg-ink text-cream hover:bg-coal">
              <Bike className="h-5 w-5" /> Start your order
            </Link>
          </div>
          <img src={cdn(images.peppersoup, 900)} alt="A bowl of pepper soup" className="h-full min-h-64 w-full object-cover" />
        </div>
      </section>
    </>
  )
}

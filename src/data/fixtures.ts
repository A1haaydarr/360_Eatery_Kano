/**
 * Stubbed data for 360 Eatery.
 *
 * Every screen reads menu items, orders and sales figures from this module.
 * A later milestone swaps these fixtures for Netlify Database queries — see PLAN.md.
 * The restaurant details, dishes and prices below are 360 Eatery Kano's real menu;
 * the orders and weekly sales further down are still sample data.
 */

export type Category = 'Rice Dishes' | 'Swallow' | 'Pepper Soups' | 'Local Favourites' | 'Drinks'

export const categories: Array<Category> = ['Rice Dishes', 'Swallow', 'Pepper Soups', 'Local Favourites', 'Drinks']

export interface FoodItem {
  id: string
  name: string
  category: Category
  price: number
  image: string
  shortDescription: string
  description: string
  prepMinutes: number
  spicy?: boolean
  popular?: boolean
  available: boolean
  stock: number
  extras: Array<{ id: string; name: string; price: number }>
}

/** Image file names in /public/img — served through the Netlify Image CDN. */
export const images = {
  hero: 'hero.png',
  jollof: 'jollof.png',
  friedrice: 'friedrice.png',
  egusi: 'egusi.png',
  suya: 'suya.png',
  peppersoup: 'peppersoup.png',
  shawarma: 'shawarma.png',
  smallchops: 'smallchops.png',
  chapman: 'chapman.png',
}

export function cdn(file: string, width: number) {
  return `/.netlify/images?url=/img/${file}&w=${width}&fm=webp`
}

export const restaurant = {
  name: '360 Eatery Kano',
  tagline: 'Every flavour, full circle.',
  phone: '0903 243 6689',
  address: "No. 2 Kakumi Plaza, Sheikh Ja'afar Road, Dorayi, Kano",
  hours: 'Mon – Sun · 9:00am – 10:00pm',
  deliveryFee: 1500,
  serviceFee: 200,
}

/** The 360 Eatery Kano menu. Photos are placeholders until the real dish photos are added. */
export const menu: Array<FoodItem> = [
  {
    id: 'jollof-rice',
    name: 'Jollof Rice',
    category: 'Rice Dishes',
    price: 1000,
    image: images.jollof,
    shortDescription: 'Rich, peppery jollof rice cooked in a tomato base.',
    description: 'Long-grain rice slow-cooked in a seasoned tomato and pepper base until every grain is full of flavour.',
    prepMinutes: 15,
    popular: true,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'fried-rice',
    name: 'Fried Rice',
    category: 'Rice Dishes',
    price: 1000,
    image: images.friedrice,
    shortDescription: 'Vegetable fried rice, seasoned and stir-fried.',
    description: 'Fluffy rice stir-fried with mixed vegetables and seasoning.',
    prepMinutes: 15,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'white-rice',
    name: 'White Rice',
    category: 'Rice Dishes',
    price: 1000,
    image: images.jollof,
    shortDescription: 'Plain boiled white rice.',
    description: 'Soft, fluffy boiled white rice — pairs well with any of our soups.',
    prepMinutes: 10,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'tuwo',
    name: 'Tuwo',
    category: 'Swallow',
    price: 1000,
    image: images.egusi,
    shortDescription: 'Soft tuwo served with soup.',
    description: 'Freshly made tuwo, a northern classic, served with soup.',
    prepMinutes: 15,
    popular: true,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'sakwara',
    name: 'Sakwara',
    category: 'Swallow',
    price: 1500,
    image: images.egusi,
    shortDescription: 'Smooth pounded yam served with soup.',
    description: 'Freshly pounded yam (sakwara), smooth and filling, served with soup.',
    prepMinutes: 20,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'ram-pepper-soup',
    name: 'Ram Pepper Soup',
    category: 'Pepper Soups',
    price: 1000,
    image: images.peppersoup,
    shortDescription: 'Spicy ram meat pepper soup.',
    description: 'Tender ram meat simmered in a hot, aromatic pepper soup broth.',
    prepMinutes: 15,
    spicy: true,
    popular: true,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'cowtail',
    name: 'Cowtail',
    category: 'Pepper Soups',
    price: 2000,
    image: images.peppersoup,
    shortDescription: 'Slow-cooked cowtail in a peppery broth.',
    description: 'Cowtail cooked slowly until tender in a spicy, well-seasoned broth.',
    prepMinutes: 20,
    spicy: true,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'kayan-ciki',
    name: 'Kayan Ciki',
    category: 'Pepper Soups',
    price: 1000,
    image: images.peppersoup,
    shortDescription: 'Assorted offal, well seasoned and peppery.',
    description: 'Assorted offal (kayan ciki) cooked with pepper and spices.',
    prepMinutes: 15,
    spicy: true,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'masar-bauchi',
    name: 'Masar Bauchi',
    category: 'Local Favourites',
    price: 300,
    image: images.smallchops,
    shortDescription: 'Soft fried rice cakes, Bauchi style.',
    description: 'Masa made the Bauchi way — soft, lightly fried rice cakes.',
    prepMinutes: 10,
    popular: true,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'dan-wake',
    name: 'Dan Wake',
    category: 'Local Favourites',
    price: 1000,
    image: images.smallchops,
    shortDescription: 'Bean dumplings served with pepper and oil.',
    description: 'Soft bean-flour dumplings (dan wake), served with pepper and oil.',
    prepMinutes: 10,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'indomie',
    name: 'Indomie',
    category: 'Local Favourites',
    price: 1200,
    image: images.friedrice,
    shortDescription: 'Cooked Indomie noodles.',
    description: 'Indomie noodles cooked fresh to order.',
    prepMinutes: 10,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'tea',
    name: 'Tea',
    category: 'Drinks',
    price: 500,
    image: images.chapman,
    shortDescription: 'A hot cup of tea.',
    description: 'A hot cup of tea, made to order.',
    prepMinutes: 5,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'kunun-gyada',
    name: 'Kunun Gyada',
    category: 'Drinks',
    price: 500,
    image: images.chapman,
    shortDescription: 'Smooth groundnut kunu.',
    description: 'Traditional kunun gyada — a smooth, creamy groundnut drink.',
    prepMinutes: 5,
    available: true,
    stock: 50,
    extras: [],
  },
  {
    id: 'kunun-madara',
    name: 'Kunun Madara',
    category: 'Drinks',
    price: 1000,
    image: images.chapman,
    shortDescription: 'Creamy milk kunu.',
    description: 'Kunun madara — a creamy, milky kunu drink.',
    prepMinutes: 5,
    available: true,
    stock: 50,
    extras: [],
  },
]

export function getFood(id: string) {
  return menu.find((item) => item.id === id)
}

export type FulfilmentType = 'delivery' | 'pickup'

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'

export const statusLabels: Record<OrderStatus, string> = {
  placed: 'Order placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  out_for_delivery: 'Out for delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

/** The status steps a customer sees, which depend on how they receive the order. */
export function statusFlow(type: FulfilmentType): Array<OrderStatus> {
  return type === 'delivery'
    ? ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'completed']
    : ['placed', 'confirmed', 'preparing', 'ready', 'completed']
}

export interface OrderLine {
  foodId: string
  name: string
  unitPrice: number
  quantity: number
  extras: Array<string>
}

export interface Order {
  id: string
  customerName: string
  phone: string
  createdAt: string
  type: FulfilmentType
  address?: string
  notes?: string
  paymentMethod: 'card' | 'transfer' | 'cash'
  paid: boolean
  status: OrderStatus
  lines: Array<OrderLine>
  total: number
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

/** Sample orders shown on the admin board and seeded into the customer's history. */
export const sampleOrders: Array<Order> = [
  {
    id: '360-1048',
    customerName: 'Amina Bello',
    phone: '0803 555 0148',
    createdAt: minutesAgo(4),
    type: 'delivery',
    address: '12 Zaria Road, Gyadi-Gyadi, Kano',
    paymentMethod: 'card',
    paid: true,
    status: 'placed',
    lines: [
      { foodId: 'jollof-rice', name: 'Jollof Rice', unitPrice: 1000, quantity: 2, extras: [] },
      { foodId: 'kunun-gyada', name: 'Kunun Gyada', unitPrice: 500, quantity: 2, extras: [] },
    ],
    total: 4700,
  },
  {
    id: '360-1047',
    customerName: 'Tunde Okafor',
    phone: '0812 555 0147',
    createdAt: minutesAgo(11),
    type: 'pickup',
    paymentMethod: 'transfer',
    paid: true,
    status: 'confirmed',
    lines: [{ foodId: 'ram-pepper-soup', name: 'Ram Pepper Soup', unitPrice: 1000, quantity: 3, extras: [] }],
    total: 3200,
  },
  {
    id: '360-1046',
    customerName: 'Chiamaka Eze',
    phone: '0905 555 0146',
    createdAt: minutesAgo(19),
    type: 'delivery',
    address: '4 Dorayi Babba, Kano',
    paymentMethod: 'card',
    paid: true,
    status: 'preparing',
    lines: [
      { foodId: 'tuwo', name: 'Tuwo', unitPrice: 1000, quantity: 1, extras: [] },
      { foodId: 'cowtail', name: 'Cowtail', unitPrice: 2000, quantity: 1, extras: [] },
    ],
    total: 4700,
  },
  {
    id: '360-1045',
    customerName: 'Ibrahim Musa',
    phone: '0708 555 0145',
    createdAt: minutesAgo(27),
    type: 'pickup',
    paymentMethod: 'cash',
    paid: false,
    status: 'ready',
    lines: [
      { foodId: 'masar-bauchi', name: 'Masar Bauchi', unitPrice: 300, quantity: 5, extras: [] },
      { foodId: 'dan-wake', name: 'Dan Wake', unitPrice: 1000, quantity: 1, extras: [] },
    ],
    total: 2700,
  },
  {
    id: '360-1044',
    customerName: 'Grace Adeyemi',
    phone: '0816 555 0144',
    createdAt: minutesAgo(38),
    type: 'delivery',
    address: '27 Sharada Road, Kano',
    paymentMethod: 'card',
    paid: true,
    status: 'out_for_delivery',
    lines: [{ foodId: 'indomie', name: 'Indomie', unitPrice: 1200, quantity: 2, extras: [] }],
    total: 4100,
  },
  {
    id: '360-1043',
    customerName: 'Yusuf Danladi',
    phone: '0802 555 0143',
    createdAt: minutesAgo(65),
    type: 'pickup',
    paymentMethod: 'transfer',
    paid: true,
    status: 'completed',
    lines: [
      { foodId: 'fried-rice', name: 'Fried Rice', unitPrice: 1000, quantity: 1, extras: [] },
      { foodId: 'tea', name: 'Tea', unitPrice: 500, quantity: 1, extras: [] },
    ],
    total: 1700,
  },
]

/** Seven-day sales summary for the admin overview. */
export const weeklySales = [
  { day: 'Fri', revenue: 128500, orders: 41 },
  { day: 'Sat', revenue: 176200, orders: 57 },
  { day: 'Sun', revenue: 151400, orders: 49 },
  { day: 'Mon', revenue: 94800, orders: 31 },
  { day: 'Tue', revenue: 103600, orders: 34 },
  { day: 'Wed', revenue: 117300, orders: 38 },
  { day: 'Thu', revenue: 136900, orders: 44 },
]

export const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

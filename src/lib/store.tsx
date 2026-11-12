import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  type FoodItem,
  type FulfilmentType,
  type Order,
  type OrderStatus,
  menu as fixtureMenu,
  restaurant,
  sampleOrders,
} from '@/data/fixtures'

/**
 * Client-side store for milestone 1. Cart, orders and menu edits live in
 * localStorage so the customer and admin screens stay in sync across tabs.
 * Milestone 2 replaces this with server functions backed by Netlify Database.
 */

export interface CartLine {
  key: string
  foodId: string
  quantity: number
  extraIds: Array<string>
}

export interface CheckoutDetails {
  customerName: string
  phone: string
  type: FulfilmentType
  address?: string
  notes?: string
  paymentMethod: Order['paymentMethod']
}

interface StoreValue {
  menu: Array<FoodItem>
  cart: Array<CartLine>
  orders: Array<Order>
  myOrderIds: Array<string>
  addToCart: (foodId: string, quantity: number, extraIds: Array<string>) => void
  setQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  placeOrder: (details: CheckoutDetails) => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void
  saveFood: (item: FoodItem) => void
  removeFood: (id: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

// Versioned so browsers holding the old sample menu start fresh with the real one.
const KEYS = { cart: '360:v2:cart', orders: '360:v2:orders', mine: '360:v2:my-orders', menu: '360:v2:menu' }

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function lineTotal(line: CartLine, menu: Array<FoodItem>) {
  const food = menu.find((f) => f.id === line.foodId)
  if (!food) return 0
  const extras = food.extras.filter((e) => line.extraIds.includes(e.id))
  return (food.price + extras.reduce((s, e) => s + e.price, 0)) * line.quantity
}

export function cartTotals(cart: Array<CartLine>, menu: Array<FoodItem>, type: FulfilmentType) {
  const subtotal = cart.reduce((s, l) => s + lineTotal(l, menu), 0)
  const delivery = type === 'delivery' && subtotal > 0 ? restaurant.deliveryFee : 0
  const service = subtotal > 0 ? restaurant.serviceFee : 0
  return { subtotal, delivery, service, total: subtotal + delivery + service }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<Array<FoodItem>>(fixtureMenu)
  const [cart, setCart] = useState<Array<CartLine>>([])
  const [orders, setOrders] = useState<Array<Order>>(sampleOrders)
  const [myOrderIds, setMyOrderIds] = useState<Array<string>>([])
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(() => {
    setMenu(read(KEYS.menu, fixtureMenu))
    setCart(read(KEYS.cart, []))
    setOrders(read(KEYS.orders, sampleOrders))
    setMyOrderIds(read(KEYS.mine, []))
  }, [])

  useEffect(() => {
    load()
    setLoaded(true)
    const onStorage = (e: StorageEvent) => e.key?.startsWith('360:') && load()
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [load])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(KEYS.menu, JSON.stringify(menu))
    localStorage.setItem(KEYS.cart, JSON.stringify(cart))
    localStorage.setItem(KEYS.orders, JSON.stringify(orders))
    localStorage.setItem(KEYS.mine, JSON.stringify(myOrderIds))
  }, [loaded, menu, cart, orders, myOrderIds])

  const addToCart = useCallback((foodId: string, quantity: number, extraIds: Array<string>) => {
    const key = [foodId, ...[...extraIds].sort()].join('|')
    setCart((prev) => {
      const existing = prev.find((l) => l.key === key)
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + quantity } : l))
      }
      return [...prev, { key, foodId, quantity, extraIds }]
    })
  }, [])

  const setQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, quantity } : l)),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const placeOrder = useCallback(
    (details: CheckoutDetails) => {
      const totals = cartTotals(cart, menu, details.type)
      const nextNumber = Math.max(1048, ...orders.map((o) => Number(o.id.split('-')[1]) || 0)) + 1
      const order: Order = {
        id: `360-${nextNumber}`,
        ...details,
        address: details.type === 'delivery' ? details.address : undefined,
        createdAt: new Date().toISOString(),
        paid: details.paymentMethod !== 'cash',
        status: 'placed',
        total: totals.total,
        lines: cart.map((l) => {
          const food = menu.find((f) => f.id === l.foodId)!
          return {
            foodId: l.foodId,
            name: food.name,
            unitPrice: lineTotal({ ...l, quantity: 1 }, menu),
            quantity: l.quantity,
            extras: food.extras.filter((e) => l.extraIds.includes(e.id)).map((e) => e.name),
          }
        }),
      }
      setOrders((prev) => [order, ...prev])
      setMyOrderIds((prev) => [order.id, ...prev])
      setMenu((prev) =>
        prev.map((f) => {
          const qty = cart.filter((l) => l.foodId === f.id).reduce((s, l) => s + l.quantity, 0)
          return qty ? { ...f, stock: Math.max(0, f.stock - qty) } : f
        }),
      )
      setCart([])
      return order
    },
    [cart, menu, orders],
  )

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, paid: o.paid || status === 'completed' } : o)),
    )
  }, [])

  const saveFood = useCallback((item: FoodItem) => {
    setMenu((prev) => (prev.some((f) => f.id === item.id) ? prev.map((f) => (f.id === item.id ? item : f)) : [...prev, item]))
  }, [])

  const removeFood = useCallback((id: string) => {
    setMenu((prev) => prev.filter((f) => f.id !== id))
    setCart((prev) => prev.filter((l) => l.foodId !== id))
  }, [])

  const value = useMemo(
    () => ({ menu, cart, orders, myOrderIds, addToCart, setQuantity, clearCart, placeOrder, updateOrderStatus, saveFood, removeFood }),
    [menu, cart, orders, myOrderIds, addToCart, setQuantity, clearCart, placeOrder, updateOrderStatus, saveFood, removeFood],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

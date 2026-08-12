'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/products-data'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleCart: () => void
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalCount: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setIsOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            }
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          }
        }),

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      getTotalPrice: () => {
        return Math.round(
          get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) * 100
        ) / 100
      },
    }),
    {
      name: 'nsvair-diagnosis-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

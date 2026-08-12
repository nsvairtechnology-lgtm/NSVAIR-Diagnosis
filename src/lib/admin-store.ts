'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getAllProducts,
  type Product,
  type ProductCategory,
  CATEGORY_DEFINITIONS,
} from '@/lib/products-data'

interface AdminState {
  products: Product[]
  customProducts: Product[]
  deletedIds: string[]
  updatedProducts: Record<string, Partial<Product>>
  isAuthenticated: boolean
  setAuthenticated: (auth: boolean) => void

  // CRUD actions
  getEffectiveProducts: () => Product[]
  getProduct: (idOrSlug: string) => Product | undefined
  addProduct: (product: Omit<Product, 'id'>) => Product
  updateProduct: (id: string, updates: Partial<Product>) => boolean
  deleteProduct: (id: string) => boolean
  resetCatalog: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: [],
      customProducts: [],
      deletedIds: [],
      updatedProducts: {},
      isAuthenticated: false,

      setAuthenticated: (auth) => set({ isAuthenticated: auth }),

      getEffectiveProducts: () => {
        const base = getAllProducts()
        const { customProducts, deletedIds, updatedProducts } = get()

        // Filter deleted
        let list = base.filter((p) => !deletedIds.includes(p.id))

        // Apply updates
        list = list.map((p) => {
          if (updatedProducts[p.id]) {
            return { ...p, ...updatedProducts[p.id] }
          }
          return p
        })

        // Append newly created custom products
        const validCustom = customProducts.filter((p) => !deletedIds.includes(p.id))
        return [...validCustom, ...list]
      },

      getProduct: (idOrSlug) => {
        const list = get().getEffectiveProducts()
        return list.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
      },

      addProduct: (data) => {
        const id = `custom-prod-${Date.now()}`
        const slug =
          data.slug ||
          data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')

        const newProd: Product = {
          ...data,
          id,
          slug,
          sku: data.sku || `NSV-CUST-${Date.now().toString().slice(-4)}`,
          categoryLabel: CATEGORY_DEFINITIONS[data.category]?.label || 'Medical Diagnostic',
          rating: data.rating || 5.0,
          reviewCount: data.reviewCount || 1,
          inStock: data.inStock !== false,
          stockCount: data.stockCount || 50,
          brand: 'NSVAIR Diagnosis',
          parentCompany: 'NSVAIR GROUP OF INDUSTRY',
          imageGradient: data.imageGradient || 'from-emerald-600 to-teal-700',
          iconType: data.iconType || 'Sparkles',
          features: data.features || ['Hospital Grade Medical Certified', 'Direct WhatsApp Support (+91 9599497690)'],
          specifications: data.specifications || { Standard: 'ISO 13485 Medical' },
          inTheBox: data.inTheBox || ['1x Medical Diagnostic Item', '1x User Guide & Warranty'],
          tags: data.tags || [data.category, 'custom-product'],
        }

        set((state) => ({
          customProducts: [newProd, ...state.customProducts],
        }))

        return newProd
      },

      updateProduct: (id, updates) => {
        const { customProducts, updatedProducts } = get()
        const isCustom = customProducts.some((p) => p.id === id)

        if (isCustom) {
          set({
            customProducts: customProducts.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          })
          return true
        }

        // It's a catalog product: store update overlay
        set({
          updatedProducts: {
            ...updatedProducts,
            [id]: {
              ...(updatedProducts[id] || {}),
              ...updates,
            },
          },
        })
        return true
      },

      deleteProduct: (id) => {
        set((state) => ({
          deletedIds: [...state.deletedIds, id],
          customProducts: state.customProducts.filter((p) => p.id !== id),
        }))
        return true
      },

      resetCatalog: () =>
        set({
          customProducts: [],
          deletedIds: [],
          updatedProducts: {},
        }),
    }),
    {
      name: 'nsvair-admin-store',
    }
  )
)

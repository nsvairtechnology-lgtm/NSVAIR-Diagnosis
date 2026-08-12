'use client'

import * as React from 'react'
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Star,
  Plus,
  ArrowRight,
  Filter,
  Check,
  Building2,
  Phone,
  Mail,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react'
import {
  getAllProducts,
  searchProducts,
  CATEGORY_DEFINITIONS,
  type Product,
  type ProductCategory
} from '@/lib/products-data'
import { useAdminStore } from '@/lib/admin-store'
import { useCartStore } from '@/lib/cart-store'
import { ProductImage } from '@/components/store/product-image'
import { CartDrawer } from '@/components/store/cart-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { openWhatsApp } from '@/lib/report-sharing'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { MobileBottomNav } from '@/components/diagnosis/mobile-bottom-nav'

const ITEMS_PER_PAGE = 24

export function StoreFront() {
  const { addItem, toggleCart, getTotalCount } = useCartStore()
  const { getEffectiveProducts } = useAdminStore()

  const [mounted, setMounted] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | 'all'>('all')
  const [selectedSort, setSelectedSort] = React.useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular')
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Filtered & Sorted Product List
  const filteredProducts = React.useMemo(() => {
    let list = mounted ? getEffectiveProducts() : getAllProducts()

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    switch (selectedSort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
      default:
        list.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    return list
  }, [mounted, getEffectiveProducts, searchQuery, selectedCategory, selectedSort])

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Reset page when category or search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedSort])

  const totalCartCount = getTotalCount()

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success(`Added "${product.name}" to cart!`)
  }

  const handleQuickWhatsAppBuy = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const msg = `🛍️ *PURCHASE INQUIRY — NSVAIR DIAGNOSIS STORE*\n*Powered by NSVAIR GROUP OF INDUSTRY*\n──────────────────────────────\n📦 *Product:* ${product.name}\n🔖 *SKU:* \`${product.sku}\`\n💵 *Price:* $${product.price} (MSRP $${product.originalPrice})\n⭐ *Rating:* ${product.rating}/5.0\n🔗 *URL:* https://nsvair-diagnosis.onrender.com/store/${product.slug}\n──────────────────────────────\nPlease confirm availability and payment details.`
    openWhatsApp('9599497690', msg)
    toast.success('Opening WhatsApp for instant purchase...')
  }

  return (
    <div className="min-h-screen bg-background text-foreground space-y-8 pb-24 md:pb-16">
      <CartDrawer />

      {/* Top Banner Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:bg-emerald-700 transition-colors">
                N
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-tight flex items-center gap-1">
                  <span>NSVAIR</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Store</span>
                </div>
                <div className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                  NSVAIR GROUP OF INDUSTRY
                </div>
              </div>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-border mx-1" />

            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              ← Back to AI Health Diagnostics
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/919599497690"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold text-emerald-600 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+91 9599497690</span>
            </a>

            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <span>Admin</span>
              </Button>
            </Link>

            <Button
              onClick={toggleCart}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm relative h-9 px-3.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {totalCartCount > 0 && (
                <span className="h-5 min-w-[20px] px-1 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px] flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 space-y-8">
        {/* Store Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-800 to-cyan-900 text-white p-6 md:p-10 shadow-lg border border-emerald-500/30">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
          <div className="relative space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5 font-semibold text-xs py-1 px-3 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Official Medical Marketplace
              </Badge>
              <Badge className="bg-emerald-950/60 text-emerald-200 border border-emerald-400/30 gap-1 text-xs py-1 px-3 backdrop-blur-sm">
                <Building2 className="h-3.5 w-3.5" /> Powered by NSVAIR GROUP OF INDUSTRY
              </Badge>
              <Badge className="bg-white/10 text-white text-xs py-1 px-3 backdrop-blur-sm">
                500+ Verified Diagnostic Products
              </Badge>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Clinical Diagnostic Kits, AI Passes & Medical Imaging Hardware
            </h1>
            <p className="text-white/90 text-xs md:text-sm leading-relaxed max-w-2xl">
              Equip yourself with hospital-grade wireless ultrasound probes, digital dermatoscopes, at-home blood test panels, and multi-modal AI screening passes. ISO 13485 certified with rapid worldwide clinic delivery.
            </p>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2.5 backdrop-blur-sm border border-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
                <span className="text-[11px] font-semibold">100% Medical Grade</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2.5 backdrop-blur-sm border border-white/10">
                <Truck className="h-4 w-4 text-sky-300 shrink-0" />
                <span className="text-[11px] font-semibold">Express Cold-Chain Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2.5 backdrop-blur-sm border border-white/10">
                <Award className="h-4 w-4 text-amber-300 shrink-0" />
                <span className="text-[11px] font-semibold">FDA & CE Registered</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2.5 backdrop-blur-sm border border-white/10">
                <Headphones className="h-4 w-4 text-teal-300 shrink-0" />
                <span className="text-[11px] font-semibold">24/7 Clinical Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, SKU, condition, or test type (e.g. Ultrasound, CBC, X-Ray, ECG)..."
                className="pl-10 h-10 text-xs shadow-sm bg-card"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Sort:
              </span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="h-10 rounded-lg border border-input bg-card px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
              >
                <option value="popular">Most Popular & Best Selling</option>
                <option value="rating">Highest Clinical Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scroll">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 shadow-sm',
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20'
                  : 'bg-card hover:bg-muted text-muted-foreground border-border'
              )}
            >
              <span>All Products</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-mono ml-1">
                {getAllProducts().length}
              </Badge>
            </button>

            {Object.entries(CATEGORY_DEFINITIONS).map(([key, def]) => {
              const isActive = selectedCategory === key
              const catCount = getAllProducts().filter((p) => p.category === key).length
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as ProductCategory)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 shadow-sm',
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20'
                      : 'bg-card hover:bg-muted text-muted-foreground border-border'
                  )}
                >
                  <span>{def.label}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-mono ml-1">
                    {catCount}
                  </Badge>
                </button>
              )
            })}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing <strong>{paginatedProducts.length}</strong> of <strong>{filteredProducts.length}</strong> medical products
            </span>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
        </div>

        {/* Product Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed p-8 space-y-3">
            <Search className="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <h3 className="font-bold text-base">No Products Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn&apos;t find any items matching &quot;{searchQuery}&quot;. Try adjusting your search query or switching categories.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {paginatedProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 flex flex-col bg-card"
              >
                {/* Product Image Link */}
                <Link href={`/store/${product.slug}`} className="block relative overflow-hidden">
                  <ProductImage product={product} size="md" />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-2 left-2 z-20">
                      <Badge
                        className={cn(
                          'text-[10px] font-extrabold uppercase shadow-sm border-0',
                          product.badge === 'Best Seller'
                            ? 'bg-amber-500 text-slate-950'
                            : product.badge === 'AI Powered'
                            ? 'bg-emerald-500 text-white'
                            : product.badge === 'Clinical Grade'
                            ? 'bg-blue-600 text-white'
                            : 'bg-teal-600 text-white'
                        )}
                      >
                        {product.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Discount percentage tag */}
                  {product.discountPercent > 0 && (
                    <div className="absolute bottom-2 right-2 z-20">
                      <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-md shadow-sm">
                        -{product.discountPercent}% OFF
                      </span>
                    </div>
                  )}
                </Link>

                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground uppercase font-semibold tracking-wider truncate max-w-[140px]">
                        {product.subCategory}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{product.rating}</span>
                        <span className="text-muted-foreground font-normal">({product.reviewCount})</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <Link
                      href={`/store/${product.slug}`}
                      className="font-bold text-xs hover:text-emerald-600 transition-colors line-clamp-2 leading-snug"
                    >
                      {product.name}
                    </Link>

                    {/* Short Description */}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="space-y-2.5 pt-2 border-t">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-foreground">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        In Stock ({product.stockCount})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <Button
                        onClick={(e) => handleQuickAddToCart(product, e)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1 font-semibold shadow-sm"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={(e) => handleQuickWhatsAppBuy(product, e)}
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      >
                        <MessageCircle className="h-3 w-3 text-emerald-500" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="h-9 px-3 gap-1 text-xs"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex items-center gap-1 text-xs font-semibold px-2">
              <span>Page {currentPage} of {totalPages}</span>
            </div>

            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="h-9 px-3 gap-1 text-xs"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t mt-16 py-8 bg-muted/20 text-center text-xs text-muted-foreground space-y-2">
        <p className="font-bold text-foreground">
          NSVAIR Diagnosis Medical Store & Marketplace • Powered by NSVAIR GROUP OF INDUSTRY
        </p>
        <p>
          Direct Order Support: WhatsApp <a href="https://wa.me/919599497690" className="text-emerald-600 font-semibold underline">+91 9599497690</a> | Email <a href="mailto:nsvairdiagnosis@gmail.com" className="text-emerald-600 font-semibold underline">nsvairdiagnosis@gmail.com</a>
        </p>
        <p className="text-[10px]">
          © {new Date().getFullYear()} NSVAIR GROUP OF INDUSTRY. All diagnostic products, AI passes, and clinical devices are protected under international medical standards.
        </p>
      </footer>

      {/* Mobile Application Native Bottom Bar */}
      <MobileBottomNav
        onOpenReport={() => {
          window.location.href = '/?action=report'
        }}
        onOpenProfile={() => {
          window.location.href = '/?action=profile'
        }}
      />
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  ShoppingBag,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Share2,
  ArrowLeft,
  MessageCircle,
  FileText,
  Sparkles,
  Download
} from 'lucide-react'
import { ProductImage } from '@/components/store/product-image'
import { CartDrawer } from '@/components/store/cart-drawer'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { openWhatsApp, openEmail } from '@/lib/report-sharing'
import type { Product } from '@/lib/products-data'
import { toast } from 'sonner'
import Link from 'next/link'
import { MobileBottomNav } from '@/components/diagnosis/mobile-bottom-nav'

export function ProductDetail({
  product,
  relatedProducts = [],
}: {
  product: Product
  relatedProducts?: Product[]
}) {
  const { addItem, toggleCart, getTotalCount } = useCartStore()
  const [quantity, setQuantity] = React.useState(1)
  const [activeTab, setActiveTab] = React.useState('specs')

  const totalCartCount = getTotalCount()

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`Added ${quantity}x "${product.name}" to cart!`)
  }

  const handleWhatsAppBuy = () => {
    const msg = `🛍️ *PURCHASE ORDER — NSVAIR DIAGNOSIS STORE*\n*Powered by NSVAIR GROUP OF INDUSTRY*\n──────────────────────────────\n📦 *Product:* ${product.name}\n🔖 *SKU:* \`${product.sku}\`\n🔢 *Quantity:* ${quantity}\n💵 *Unit Price:* $${product.price}\n💰 *Total:* $${Math.round(product.price * quantity * 100) / 100}\n⭐ *Clinical Rating:* ${product.rating}/5.0\n🔗 *URL:* https://nsvair-diagnosis.onrender.com/store/${product.slug}\n──────────────────────────────\nPlease provide invoice and delivery details.`
    openWhatsApp('9599497690', msg)
    toast.success('Opening WhatsApp to complete purchase with NSVAIR...')
  }

  const handleGmailBuy = () => {
    const text = `PURCHASE INQUIRY — NSVAIR DIAGNOSIS STORE
Powered by NSVAIR GROUP OF INDUSTRY
================================================================================
Product: ${product.name}
SKU: ${product.sku}
Quantity: ${quantity}
Unit Price: $${product.price} (MSRP $${product.originalPrice})
Total Amount: $${Math.round(product.price * quantity * 100) / 100}
Product URL: https://nsvair-diagnosis.onrender.com/store/${product.slug}
================================================================================
Please send proforma invoice, shipping options, and payment link.`

    const subject = `[Purchase Inquiry] ${product.name} (SKU: ${product.sku}) — $${product.price}`
    openEmail('nsvairdiagnosis@gmail.com', subject, text, true)
    toast.success('Opening Gmail compose for NSVAIR purchase...')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground space-y-8 pb-24 md:pb-16">
      <CartDrawer />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/store" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
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
              href="/store"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Store Catalog
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="h-9 px-2.5 text-xs gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>

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

      {/* Main Product Container */}
      <main className="container max-w-7xl mx-auto px-4 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/store" className="hover:text-foreground">Store</Link>
          <span>/</span>
          <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
          <span>/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Artwork & Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <ProductImage product={product} size="hero" />
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-muted-foreground">
              <div className="p-2.5 rounded-xl border bg-card flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>ISO 13485 Certified</span>
              </div>
              <div className="p-2.5 rounded-xl border bg-card flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 text-sky-500" />
                <span>Free Clinic Shipping</span>
              </div>
              <div className="p-2.5 rounded-xl border bg-card flex flex-col items-center gap-1">
                <Building2 className="h-4 w-4 text-amber-500" />
                <span>NSVAIR Official</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Buy Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold text-[10px]">
                  {product.categoryLabel}
                </Badge>
                {product.badge && (
                  <Badge variant="outline" className="text-[10px] font-bold border-amber-500/40 text-amber-600">
                    {product.badge}
                  </Badge>
                )}
                <span className="text-xs font-mono text-muted-foreground ml-auto">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Rating & Brand */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="text-sm">{product.rating}</span>
                  <span className="text-muted-foreground font-normal">({product.reviewCount} verified doctor reviews)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Brand: <strong className="text-foreground">{product.brand}</strong></span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge className="bg-red-600 text-white font-extrabold text-[11px]">
                      SAVE {product.discountPercent}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Price includes clinical certification, standard software license, and priority AI reporting pipeline.
              </p>
            </div>

            {/* Short Description & Highlights */}
            <div className="space-y-3">
              <p className="text-sm text-foreground/90 leading-relaxed">
                {product.shortDescription}
              </p>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Key Diagnostic Features:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity & Ordering Buttons */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold">Quantity:</span>
                <div className="flex items-center border rounded-lg overflow-hidden bg-card">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-8 w-8 flex items-center justify-center hover:bg-muted text-muted-foreground"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-8 w-8 flex items-center justify-center hover:bg-muted text-muted-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-xs text-emerald-600 font-semibold ml-2">
                  ✓ In Stock ({product.stockCount} available)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm h-11 shadow-sm gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add to Cart — ${Math.round(product.price * quantity * 100) / 100}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleWhatsAppBuy}
                    variant="outline"
                    className="h-10 text-xs font-bold gap-1.5 text-emerald-600 border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-500" />
                    Buy on WhatsApp
                  </Button>
                  <Button
                    onClick={handleGmailBuy}
                    variant="outline"
                    className="h-10 text-xs font-bold gap-1.5 text-red-600 border-red-500/40 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Mail className="h-4 w-4 text-red-500" />
                    Order via Gmail
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="space-y-4 pt-6 border-t">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 max-w-lg">
              <TabsTrigger value="specs" className="text-xs font-semibold">
                Clinical Specs
              </TabsTrigger>
              <TabsTrigger value="desc" className="text-xs font-semibold">
                Full Description
              </TabsTrigger>
              <TabsTrigger value="box" className="text-xs font-semibold">
                In The Box
              </TabsTrigger>
            </TabsList>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm mb-4">Technical & Clinical Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="p-3 rounded-lg bg-muted/30 border flex justify-between">
                        <span className="font-semibold text-muted-foreground">{key}:</span>
                        <span className="font-bold text-foreground text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Full Description Tab */}
            <TabsContent value="desc" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-6 space-y-4 text-xs leading-relaxed text-foreground/90">
                  <h3 className="font-bold text-sm">Product Overview & Diagnostic Scope</h3>
                  <p className="whitespace-pre-line leading-relaxed">
                    {product.fullDescription}
                  </p>

                  <div className="pt-3 border-t">
                    <h4 className="font-bold mb-2">Key Diagnostic Benefits:</h4>
                    <ul className="space-y-1.5">
                      {product.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* In The Box Tab */}
            <TabsContent value="box" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm mb-4">Package Contents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {product.inTheBox.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-muted/20 flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Diagnostic Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-10 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Related Diagnostic Hardware & AI Passes</h3>
                <p className="text-xs text-muted-foreground">Recommended by NSVAIR clinical algorithms for comprehensive screening</p>
              </div>
              <Link href="/store" className="text-xs font-bold text-emerald-600 hover:underline">
                View All Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/store/${rel.slug}`}
                  className="group block p-3 rounded-xl border border-border/80 hover:border-emerald-500/50 bg-card hover:shadow-md transition-all space-y-2"
                >
                  <ProductImage product={rel} size="sm" />
                  <div>
                    <h4 className="font-bold text-xs group-hover:text-emerald-600 line-clamp-1 transition-colors">
                      {rel.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="font-extrabold text-foreground">${rel.price}</span>
                      <span className="text-[10px] text-muted-foreground">{rel.subCategory}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

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

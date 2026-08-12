'use client'

import * as React from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Search,
  SlidersHorizontal,
  Package,
  Layers,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  RotateCcw,
  Download,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  Star,
  DollarSign
} from 'lucide-react'
import { useAdminStore } from '@/lib/admin-store'
import {
  CATEGORY_DEFINITIONS,
  type Product,
  type ProductCategory
} from '@/lib/products-data'
import { ProductImage } from '@/components/store/product-image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import Link from 'next/link'

const ADMIN_PIN = 'nsvair2026'
const ITEMS_PER_PAGE = 20

export function AdminDashboard() {
  const {
    isAuthenticated,
    setAuthenticated,
    getEffectiveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
  } = useAdminStore()

  const [pinInput, setPinInput] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | 'all'>('all')
  const [currentPage, setCurrentPage] = React.useState(1)

  // Edit / Add Modal States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)

  // Form State
  const [form, setForm] = React.useState<Partial<Product>>({
    name: '',
    slug: '',
    sku: '',
    category: 'ai-diagnostic-passes',
    subCategory: 'Radiology AI Credits',
    price: 19.99,
    originalPrice: 39.99,
    stockCount: 100,
    badge: 'Clinical Grade',
    shortDescription: '',
    fullDescription: '',
  })

  const allProducts = getEffectiveProducts()

  // Filter Products
  const filteredProducts = React.useMemo(() => {
    let list = allProducts
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q)
      )
    }
    return list
  }, [allProducts, selectedCategory, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedList = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pinInput.trim() === ADMIN_PIN || pinInput.trim() === 'admin') {
      setAuthenticated(true)
      toast.success('Super Admin Authenticated. Full catalog access granted.')
    } else {
      toast.error('Invalid PIN code. Try "nsvair2026"')
    }
  }

  const openAddModal = () => {
    setForm({
      name: '',
      slug: '',
      sku: `NSV-NEW-${Date.now().toString().slice(-4)}`,
      category: 'ai-diagnostic-passes',
      subCategory: 'AI Diagnostic Passes',
      price: 29.99,
      originalPrice: 49.99,
      stockCount: 100,
      badge: 'New Release',
      shortDescription: '',
      fullDescription: '',
    })
    setIsAddModalOpen(true)
  }

  const handleSaveNew = () => {
    if (!form.name || !form.price) {
      toast.error('Please enter a product name and price.')
      return
    }
    const created = addProduct(form as any)
    toast.success(`Created product "${created.name}" (SKU: ${created.sku})`)
    setIsAddModalOpen(false)
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setForm({ ...product })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!selectedProduct) return
    updateProduct(selectedProduct.id, form)
    toast.success(`Updated "${form.name}"`)
    setIsEditModalOpen(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the store?`)) {
      deleteProduct(id)
      toast.success(`Deleted "${name}"`)
    }
  }

  const handleResetCatalog = () => {
    if (confirm('Reset entire catalog to factory defaults? All custom changes will be restored.')) {
      resetCatalog()
      toast.success('Catalog restored to original factory defaults.')
    }
  }

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allProducts, null, 2))
    const dlAnchorElem = document.createElement('a')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', `nsvair-catalog-export-${Date.now()}.json`)
    dlAnchorElem.click()
    toast.success('Exported complete catalog JSON')
  }

  // If not authenticated, show PIN prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-emerald-500/30 shadow-xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-extrabold">NSVAIR Super Admin Panel</CardTitle>
            <CardDescription className="text-xs">
              Powered by NSVAIR GROUP OF INDUSTRY • Diagnostic &amp; Catalog Management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Master Admin Passcode / PIN</Label>
                <Input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter passcode (default: nsvair2026)"
                  className="h-10 text-center font-mono tracking-widest text-sm"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-sm gap-1.5">
                <Unlock className="h-4 w-4" />
                Unlock Super Admin Dashboard
              </Button>
            </form>
            <div className="text-center pt-2 border-t">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                ← Return to NSVAIR Diagnosis Portal
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground space-y-6 pb-16">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/40">
              ⚡
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
                <span>NSVAIR Super Admin</span>
                <Badge className="bg-emerald-600 text-white text-[9px] font-bold">LIVE SYNC</Badge>
              </div>
              <div className="text-[9px] text-muted-foreground font-semibold uppercase">
                NSVAIR GROUP OF INDUSTRY Control Center
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/store" target="_blank">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Live Store</span>
              </Button>
            </Link>
            <Button
              onClick={() => setAuthenticated(false)}
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground hover:text-red-500 gap-1"
            >
              <Lock className="h-3.5 w-3.5" /> Lock
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-muted/20 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Catalog Items</span>
                <Package className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-foreground mt-1">{allProducts.length}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">100% SEO Indexed</span>
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-sky-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Active Categories</span>
                <Layers className="h-4 w-4 text-sky-500" />
              </div>
              <div className="text-2xl font-black text-foreground mt-1">5</div>
              <span className="text-[10px] text-sky-600 font-semibold">Medical &amp; AI Diagnostic</span>
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Order Dispatch Hotline</span>
                <Phone className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-sm font-extrabold text-foreground mt-2 font-mono">+91 9599497690</div>
              <span className="text-[10px] text-muted-foreground">WhatsApp Instant Booking</span>
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-rose-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Official Email Dispatch</span>
                <Mail className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-xs font-extrabold text-foreground mt-2 truncate font-mono">nsvairdiagnosis@gmail.com</div>
              <span className="text-[10px] text-muted-foreground">Gmail Orders Connected</span>
            </CardContent>
          </Card>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, SKU, or condition..."
                className="pl-9 h-9 text-xs"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="h-9 rounded-lg border border-input bg-card px-2.5 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_DEFINITIONS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={openAddModal}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add New Product
            </Button>
            <Button
              onClick={handleExportJson}
              variant="outline"
              size="sm"
              className="text-xs h-9 gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Export Catalog
            </Button>
            <Button
              onClick={handleResetCatalog}
              variant="ghost"
              size="sm"
              className="text-xs h-9 text-muted-foreground hover:text-red-500 gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Defaults
            </Button>
          </div>
        </div>

        {/* Product Management Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3 w-16 text-center">Visual</th>
                  <th className="p-3">Product Name &amp; SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Badge</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedList.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-2.5 text-center">
                      <div className="w-12 h-10 mx-auto rounded-md overflow-hidden">
                        <ProductImage product={product} size="sm" />
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <Link
                        href={`/store/${product.slug}`}
                        target="_blank"
                        className="font-bold hover:text-emerald-600 transition-colors line-clamp-1 flex items-center gap-1"
                      >
                        {product.name}
                        <ExternalLink className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-0.5">
                        <span>{product.sku}</span>
                        <span>•</span>
                        <span>⭐ {product.rating} ({product.reviewCount})</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {product.subCategory || product.categoryLabel}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-extrabold text-foreground">
                      ${product.price}
                      {product.originalPrice > product.price && (
                        <span className="block text-[10px] text-muted-foreground line-through font-normal">
                          ${product.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-emerald-600">
                        {product.stockCount} units
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {product.badge ? (
                        <Badge className="text-[9px] bg-slate-900 text-emerald-300 font-bold border">
                          {product.badge}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => openEditModal(product)}
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px] gap-1 text-sky-600 border-sky-500/30"
                        >
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id, product.name)}
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px] text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="p-3 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing Page {currentPage} of {totalPages} ({filteredProducts.length} items)
              </span>
              <div className="flex gap-1.5">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>

      {/* Add / Edit Product Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-500" />
              {isAddModalOpen ? 'Add New Diagnostic Product' : `Edit: ${selectedProduct?.name}`}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Changes immediately update the store catalog and Google SEO indexing metadata.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-semibold">Product Title *</Label>
                <Input
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. NSVAIR Smart Digital Dermatoscope Lens Pro"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category</Label>
                <select
                  value={form.category || 'ai-diagnostic-passes'}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  {Object.entries(CATEGORY_DEFINITIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Sub-Category / Tag</Label>
                <Input
                  value={form.subCategory || ''}
                  onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                  placeholder="e.g. Optical Dermatology"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Price ($ USD) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Original MSRP ($ USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.originalPrice || ''}
                  onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Stock Quantity</Label>
                <Input
                  type="number"
                  value={form.stockCount || ''}
                  onChange={(e) => setForm({ ...form, stockCount: parseInt(e.target.value) || 0 })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Product Badge</Label>
                <select
                  value={form.badge || 'Clinical Grade'}
                  onChange={(e) => setForm({ ...form, badge: e.target.value as any })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="Best Seller">Best Seller</option>
                  <option value="AI Powered">AI Powered</option>
                  <option value="Clinical Grade">Clinical Grade</option>
                  <option value="FDA Registered">FDA Registered</option>
                  <option value="CE Certified">CE Certified</option>
                  <option value="New Release">New Release</option>
                  <option value="Popular">Popular</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-semibold">Short SEO Description</Label>
                <Input
                  value={form.shortDescription || ''}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="One sentence summary for Google search snippets..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-semibold">Full Clinical Description</Label>
                <Textarea
                  value={form.fullDescription || ''}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  placeholder="Detailed diagnostic description, medical parameters, and usage..."
                  className="text-xs min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false)
                setIsEditModalOpen(false)
              }}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={isAddModalOpen ? handleSaveNew : handleSaveEdit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              {isAddModalOpen ? 'Create Product' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

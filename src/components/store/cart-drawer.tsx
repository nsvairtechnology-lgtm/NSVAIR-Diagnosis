'use client'

import * as React from 'react'
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  MessageCircle,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useCartStore } from '@/lib/cart-store'
import { ProductImage } from '@/components/store/product-image'
import { openWhatsApp, openEmail } from '@/lib/report-sharing'
import { toast } from 'sonner'
import Link from 'next/link'

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalCount,
    getTotalPrice,
  } = useCartStore()

  const [checkoutModalOpen, setCheckoutModalOpen] = React.useState(false)
  const [customerName, setCustomerName] = React.useState('')
  const [customerPhone, setCustomerPhone] = React.useState('9599497690')
  const [customerEmail, setCustomerEmail] = React.useState('nsvairdiagnosis@gmail.com')
  const [shippingAddress, setShippingAddress] = React.useState('')
  const [couponCode, setCouponCode] = React.useState('')
  const [discount, setDiscount] = React.useState(0)

  const totalCount = getTotalCount()
  const subtotal = getTotalPrice()
  const finalTotal = Math.max(0, Math.round((subtotal - discount) * 100) / 100)

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'NSVAIR10' || couponCode.toUpperCase() === 'HEALTH10') {
      const d = Math.round(subtotal * 0.1 * 100) / 100
      setDiscount(d)
      toast.success('Coupon NSVAIR10 applied! 10% discount added.')
    } else {
      toast.error('Invalid coupon code. Try NSVAIR10')
    }
  }

  const formatCartOrderText = () => {
    let text = `🛍️ *NEW ORDER — NSVAIR DIAGNOSIS STORE*\n`
    text += `*Powered by NSVAIR GROUP OF INDUSTRY*\n`
    text += `──────────────────────────────\n`
    text += `👤 *Customer:* ${customerName || 'Patient'}\n`
    text += `📞 *Phone:* ${customerPhone}\n`
    text += `📧 *Email:* ${customerEmail}\n`
    if (shippingAddress) {
      text += `📍 *Shipping Address:* ${shippingAddress}\n`
    }
    text += `──────────────────────────────\n`
    text += `📦 *ORDERED ITEMS (${totalCount}):*\n\n`

    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.name}*\n`
      text += `   ↳ SKU: \`${item.product.sku}\`\n`
      text += `   ↳ Qty: ${item.quantity} x $${item.product.price} = $${Math.round(item.quantity * item.product.price * 100) / 100}\n`
    })

    text += `\n──────────────────────────────\n`
    text += `💵 *Subtotal:* $${subtotal}\n`
    if (discount > 0) {
      text += `🎟️ *Discount:* -$${discount}\n`
    }
    text += `💰 *TOTAL PAYABLE:* $${finalTotal}\n`
    text += `──────────────────────────────\n`
    text += `Official Store: https://nsvair-diagnosis.onrender.com/store`

    return text
  }

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty.')
      return
    }
    const text = formatCartOrderText()
    openWhatsApp(customerPhone || '9599497690', text)
    toast.success('Opening WhatsApp to place your order with NSVAIR...')
    setCheckoutModalOpen(false)
  }

  const handleGmailCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty.')
      return
    }
    const text = formatCartOrderText().replace(/\*/g, '')
    const subject = `[New Store Order] NSVAIR Diagnosis Store — ${customerName || 'Customer'} ($${finalTotal})`
    openEmail('nsvairdiagnosis@gmail.com', subject, text, true)
    toast.success('Opening Gmail compose window for NSVAIR order dispatch...')
    setCheckoutModalOpen(false)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          <SheetHeader className="p-4 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <SheetTitle className="text-base font-bold">Shopping Cart ({totalCount})</SheetTitle>
                  <SheetDescription className="text-xs">
                    NSVAIR Diagnosis Official Medical Store
                  </SheetDescription>
                </div>
              </div>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="h-8 text-xs text-muted-foreground hover:text-red-500 gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </Button>
              )}
            </div>
          </SheetHeader>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="h-16 w-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-sm">Your Cart is Empty</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Browse over 500+ NSVAIR AI passes, handheld ultrasound devices, home lab blood test kits, and medical supplies.
                </p>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs mt-2"
                >
                  Explore Store Catalog
                </Button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3 rounded-xl border border-border/80 bg-card hover:border-emerald-500/40 transition-all flex gap-3"
                >
                  <div className="w-20 shrink-0">
                    <ProductImage product={product} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/store/${product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="font-bold text-xs hover:text-emerald-600 line-clamp-1 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {product.sku}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        ${product.price}
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] line-through text-muted-foreground font-normal">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg overflow-hidden bg-muted/30">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="h-6 w-6 flex items-center justify-center hover:bg-muted text-muted-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="h-6 w-6 flex items-center justify-center hover:bg-muted text-muted-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Quick Checkout */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-muted/20 space-y-3">
              {/* Coupon Row */}
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo code (e.g. NSVAIR10)"
                  className="h-8 text-xs font-mono uppercase"
                />
                <Button
                  onClick={handleApplyCoupon}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                >
                  Apply
                </Button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalCount} items):</span>
                  <span className="font-semibold">${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (10%):</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Clinical Shipping:</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-foreground pt-1 border-t">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">${finalTotal}</span>
                </div>
              </div>

              {/* 1-Click Order Buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs h-10 shadow-sm gap-2"
                >
                  <span>Proceed to Express Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleWhatsAppCheckout}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                    WhatsApp Order
                  </Button>
                  <Button
                    onClick={handleGmailCheckout}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-red-600 border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Mail className="h-3.5 w-3.5 text-red-500" />
                    Gmail Order
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>100% Medical Grade • Official NSVAIR GROUP OF INDUSTRY Guarantee</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Modal */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-emerald-500" />
              Express Diagnostic Order
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm your contact information to receive your order confirmation & tracking
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Full Name</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Dr. Johnathan Smith"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium">WhatsApp Phone</Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9599497690"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Email (Gmail)</Label>
                <Input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="nsvairdiagnosis@gmail.com"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Shipping Address (for physical kits/devices)</Label>
              <Textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter street address, city, state, postal code (optional for digital AI passes)"
                className="text-xs min-h-[60px]"
              />
            </div>

            {/* Order Summary Pill */}
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-300">Total Payable: ${finalTotal}</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">{totalCount} item(s) included</p>
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px]">Instant Booking</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={handleWhatsAppCheckout}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 gap-1.5"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Complete on WhatsApp
            </Button>
            <Button
              onClick={handleGmailCheckout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              Complete on Gmail
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

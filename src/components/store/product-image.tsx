'use client'

import * as React from 'react'
import {
  Sparkles,
  Activity,
  HeartPulse,
  Eye,
  FileText,
  TestTube,
  ShieldCheck,
  Stethoscope,
  PersonStanding,
  Ear,
  Sun,
  Moon,
  Apple,
  Heart,
  Package,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/products-data'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Activity,
  HeartPulse,
  Eye,
  FileText,
  TestTube,
  ShieldCheck,
  Stethoscope,
  PersonStanding,
  Ear,
  Sun,
  Moon,
  Apple,
  Heart,
  Package,
  Layers,
}

export function ProductImage({
  product,
  className,
  size = 'md',
}: {
  product: Product
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'hero'
}) {
  const IconComponent = ICON_MAP[product.iconType] || Sparkles

  const sizeClasses = {
    sm: 'h-24 w-full text-xs',
    md: 'h-48 w-full text-sm',
    lg: 'h-64 w-full text-base',
    hero: 'h-80 md:h-96 w-full text-lg',
  }[size]

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
    hero: 'h-28 w-28',
  }[size]

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 select-none shadow-inner border border-white/10 bg-gradient-to-br',
        product.imageGradient,
        sizeClasses,
        className
      )}
    >
      {/* Background aesthetic grid pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Brand Watermark */}
      <div className="absolute top-2.5 left-3 flex items-center gap-1.5 opacity-80">
        <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-white">
          NSVAIR
        </span>
      </div>

      {/* SKU Tag */}
      <div className="absolute top-2.5 right-3 text-[9px] font-mono text-white/70 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
        {product.sku}
      </div>

      {/* Main Center Vector Medical Icon */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg flex items-center justify-center transform transition-transform group-hover:scale-105 duration-300">
        <IconComponent className={cn('text-white drop-shadow-md', iconSizes)} />
      </div>

      {/* Product Tag / Subcategory Label */}
      <div className="relative z-10 mt-3 text-center">
        <span className="text-[11px] font-bold text-white/95 uppercase tracking-wider bg-black/25 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
          {product.subCategory}
        </span>
      </div>

      {/* Bottom Medical Grade Seal */}
      <div className="absolute bottom-2 inset-x-0 text-center">
        <span className="text-[9px] text-white/60 font-medium">
          ISO 13485 • NSVAIR GROUP OF INDUSTRY
        </span>
      </div>
    </div>
  )
}

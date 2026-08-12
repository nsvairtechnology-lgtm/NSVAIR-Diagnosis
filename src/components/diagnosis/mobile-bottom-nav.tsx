'use client'

import * as React from 'react'
import {
  Activity,
  FileText,
  ShoppingBag,
  User,
  Scan,
  Sparkles,
  LayoutGrid,
  CheckCircle2
} from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import { useAuthStore } from '@/lib/auth-store'
import { useCartStore } from '@/lib/cart-store'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileBottomNav({
  onOpenReport,
  onOpenProfile,
}: {
  onOpenReport: () => void
  onOpenProfile: () => void
}) {
  const pathname = usePathname()
  const isStore = pathname.startsWith('/store')
  const isAdmin = pathname.startsWith('/admin')

  const { activeModule, setActiveModule, completedCount } = useDiagnosisStore()
  const { currentUser, openAuthModal } = useAuthStore()
  const { toggleCart, getTotalCount } = useCartStore()

  const completed = completedCount()
  const totalCartCount = getTotalCount()

  const handleHomeClick = () => {
    if (activeModule) {
      setActiveModule(null)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleScanClick = () => {
    setActiveModule('radiology')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProfileClick = () => {
    if (!currentUser?.isVerified) {
      openAuthModal('general')
    } else {
      onOpenProfile()
    }
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/80 pb-safe mobile-app-shadow"
      aria-label="Mobile Application Navigation"
    >
      <div className="h-16 px-2 flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Home / Tests Tab */}
        <button
          onClick={handleHomeClick}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-all active:scale-90',
            !isStore && !isAdmin && activeModule === null
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="relative">
            <LayoutGrid className="h-5 w-5" />
            {!isStore && !isAdmin && activeModule === null && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-3 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </div>
          <span className="mt-1">Screenings</span>
        </button>

        {/* 2. Instant Scan (Center Hero Button) */}
        <button
          onClick={handleScanClick}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-all active:scale-90',
            activeModule === 'radiology'
              ? 'text-sky-600 dark:text-sky-400 font-extrabold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="relative -top-2">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-lg flex items-center justify-center border-2 border-background">
              <Scan className="h-5 w-5" />
            </div>
          </div>
          <span className="-mt-1 font-bold">X-Ray AI</span>
        </button>

        {/* 3. Medical Store Tab */}
        <Link
          href="/store"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-all active:scale-90 relative',
            isStore
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[9px] flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
            )}
            {isStore && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-3 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </div>
          <span className="mt-1">Store</span>
        </Link>

        {/* 4. Health Report Tab */}
        <button
          onClick={onOpenReport}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-all active:scale-90 relative',
            'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="relative">
            <FileText className="h-5 w-5" />
            {completed > 0 && (
              <span className="absolute -top-1 -right-2.5 h-4 min-w-[16px] px-1 rounded-full bg-emerald-600 text-white font-extrabold text-[9px] flex items-center justify-center">
                {completed}
              </span>
            )}
          </div>
          <span className="mt-1">Report</span>
        </button>

        {/* 5. Profile & Auth Tab */}
        <button
          onClick={handleProfileClick}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-all active:scale-90',
            currentUser?.isVerified
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="relative">
            {currentUser?.isVerified ? (
              <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold text-[10px] border border-emerald-500/40">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <span className="mt-1 truncate max-w-[48px]">
            {currentUser?.isVerified && currentUser?.name ? currentUser.name.split(' ')[0] : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  )
}

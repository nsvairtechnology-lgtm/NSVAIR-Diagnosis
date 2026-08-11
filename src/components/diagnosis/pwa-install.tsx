'use client'

import * as React from 'react'
import { Download, X, Smartphone, Share, Plus, Apple, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'nsvair-install-dismissed'

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = React.useState(false)
  const [showIOSGuide, setShowIOSGuide] = React.useState(false)
  const [installed, setInstalled] = React.useState(false)
  const [platform, setPlatform] = React.useState<'android' | 'ios' | 'other'>('other')

  React.useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document)
    const isAndroid = /Android/.test(ua)
    if (isIOS) setPlatform('ios')
    else if (isAndroid) setPlatform('android')
    else setPlatform('other')

    // Check if already installed (standalone mode)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    if (standalone) {
      setInstalled(true)
      return
    }

    // Check if previously dismissed (only suppress the auto-banner, not manual triggers)
    const dismissed = localStorage.getItem(DISMISS_KEY)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Only auto-show banner if not previously dismissed
      if (!dismissed) setShowBanner(true)
    }

    const showInstallHandler = () => {
      // Manual trigger from header "Install App" button — always show
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setShowBanner(false)
    })
    window.addEventListener('nsvair-show-install', showInstallHandler)

    // Auto-show banner after a delay for non-iOS (iOS has no beforeinstallprompt)
    if (!dismissed && platform !== 'ios') {
      const timer = setTimeout(() => {
        // Only auto-show if we don't have a deferred prompt yet (will show when it arrives)
        // For browsers that never fire beforeinstallprompt (iOS Safari), this shows the iOS guide path
      }, 5000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handler)
        window.removeEventListener('nsvair-show-install', showInstallHandler)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('nsvair-show-install', showInstallHandler)
    }
  }, [platform])

  // For iOS Safari, auto-show banner after delay (no beforeinstallprompt event)
  React.useEffect(() => {
    if (platform === 'ios' && !installed && !localStorage.getItem(DISMISS_KEY)) {
      const timer = setTimeout(() => setShowBanner(true), 4000)
      return () => clearTimeout(timer)
    }
  }, [platform, installed])

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        setInstalled(true)
        setShowBanner(false)
      }
      setDeferredPrompt(null)
    } else {
      // No native prompt available (iOS Safari or desktop browser without support)
      // Show the iOS / manual install guide
      setShowIOSGuide(true)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem(DISMISS_KEY, '1')
  }

  const openIOSGuide = () => setShowIOSGuide(true)

  // Don't render anything if already installed
  if (installed) return null

  if (!showBanner) return null

  return (
    <>
      <Card className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] shadow-lg border-emerald-200 animate-in slide-in-from-bottom-4 duration-300">
        <CardContent className="p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3 pr-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Install NSVAIR Diagnosis</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                Powered by NSVAIR GROUP OF INDUSTRY
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {platform === 'ios'
                  ? 'Add to your Home Screen for one-tap access — works offline like a native app.'
                  : 'Install the app on your device for one-tap access and a full-screen experience.'}
              </p>
              <div className="flex gap-2 mt-3">
                {platform === 'ios' ? (
                  <Button size="sm" onClick={openIOSGuide} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                    <Apple className="h-3.5 w-3.5" /> How to install
                  </Button>
                ) : deferredPrompt ? (
                  <Button size="sm" onClick={handleInstall} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                    <Download className="h-3.5 w-3.5" /> Install now
                  </Button>
                ) : (
                  <Button size="sm" onClick={openIOSGuide} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                    <Download className="h-3.5 w-3.5" /> Install instructions
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  Not now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* iOS installation guide sheet */}
      <Sheet open={showIOSGuide} onOpenChange={setShowIOSGuide}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {platform === 'ios' ? (
                <>
                  <Apple className="h-5 w-5" /> Install on iPhone / iPad
                </>
              ) : (
                <>
                  <Smartphone className="h-5 w-5" /> Install NSVAIR Diagnosis
                </>
              )}
            </SheetTitle>
            <SheetDescription>
              {platform === 'ios'
                ? "Follow these steps to add NSVAIR Diagnosis to your Home Screen"
                : "Install the app for one-tap access and a full-screen experience"}
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 pb-8 pt-4 space-y-4">
            <div className="space-y-3">
              {platform === 'ios' ? (
                <>
                  <Step
                    num={1}
                    icon={Share}
                    title="Tap the Share button"
                    description="Tap the Share icon at the bottom of Safari (square with an up arrow)."
                  />
                  <Step
                    num={2}
                    icon={Plus}
                    title="Select 'Add to Home Screen'"
                    description="Scroll down the options and tap 'Add to Home Screen'."
                  />
                  <Step
                    num={3}
                    icon={CheckCircle2}
                    title="Tap 'Add'"
                    description="Confirm the name and tap 'Add'. NSVAIR Diagnosis will appear on your Home Screen."
                  />
                </>
              ) : (
                <>
                  <Step
                    num={1}
                    icon={Download}
                    title="Open your browser menu"
                    description="Click the menu icon (⋮ in Chrome, ☰ in Edge) in the top-right corner."
                  />
                  <Step
                    num={2}
                    icon={Plus}
                    title="Select 'Install app' / 'Install NSVAIR Diagnosis'"
                    description="Look for 'Install' or 'Install app' option in the menu and click it."
                  />
                  <Step
                    num={3}
                    icon={CheckCircle2}
                    title="Confirm installation"
                    description="Click 'Install' in the dialog. NSVAIR Diagnosis will open as a standalone app."
                  />
                </>
              )}
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3 flex gap-2">
              <Smartphone className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Once installed, NSVAIR Diagnosis works full-screen like a native app with one-tap
                access to all 16 diagnostic modules.
              </p>
            </div>
            <Button
              onClick={() => {
                setShowIOSGuide(false)
                handleDismiss()
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Got it
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function Step({
  num,
  icon: Icon,
  title,
  description,
}: {
  num: number
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center">
        <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-emerald-600" />
        </div>
        {num < 3 && <div className="w-0.5 h-8 bg-emerald-200 dark:bg-emerald-900 mt-1" />}
      </div>
      <div className="pt-1">
        <p className="text-sm font-medium">Step {num}: {title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  Activity,
  Brain,
  Camera,
  Eye,
  FileText,
  HeartPulse,
  Mic,
  Scan,
  Sparkles,
  Stethoscope,
  Smile,
  Hand,
  Ear,
  Wind
} from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import { type ModuleId } from '@/lib/types'
import { cn } from '@/lib/utils'

interface QuickAction {
  id: ModuleId
  label: string
  icon: any
  gradient: string
  badge?: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'blood-pressure',
    label: 'BP & PWV',
    icon: HeartPulse,
    gradient: 'from-rose-600 to-red-700',
    badge: 'AHA',
  },
  {
    id: 'radiology',
    label: 'X-Ray & MRI',
    icon: Scan,
    gradient: 'from-blue-600 to-indigo-700',
    badge: 'NEW',
  },
  {
    id: 'spirometry',
    label: 'Spirometry',
    icon: Wind,
    gradient: 'from-cyan-600 to-teal-700',
    badge: 'FEV1',
  },
  {
    id: 'pupillary-reflex',
    label: 'Pupillary (PLR)',
    icon: Eye,
    gradient: 'from-amber-500 to-yellow-600',
    badge: 'NPi',
  },
  {
    id: 'lab-report',
    label: 'Lab Report',
    icon: FileText,
    gradient: 'from-teal-600 to-emerald-700',
    badge: 'OCR',
  },
  {
    id: 'vitals',
    label: 'rPPG Heart',
    icon: HeartPulse,
    gradient: 'from-rose-500 to-pink-700',
  },
  {
    id: 'skin',
    label: 'Skin AI',
    icon: Camera,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'eye',
    label: 'Eye & Jaundice',
    icon: Eye,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'voice',
    label: 'Cough Voice',
    icon: Mic,
    gradient: 'from-purple-600 to-violet-800',
  },
  {
    id: 'symptom',
    label: 'Symptom AI',
    icon: Stethoscope,
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'mental',
    label: 'Mental Health',
    icon: Brain,
    gradient: 'from-indigo-500 to-sky-700',
  },
  {
    id: 'face',
    label: 'Face Wellness',
    icon: Smile,
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'hearing',
    label: 'Hearing Test',
    icon: Ear,
    gradient: 'from-blue-500 to-cyan-700',
  },
]

export function MobileQuickActions() {
  const { setActiveModule, results } = useDiagnosisStore()

  return (
    <div className="md:hidden space-y-2 py-1">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          Quick Health Screening
        </h3>
        <span className="text-[10px] text-muted-foreground">Swipe →</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1 snap-x">
        {QUICK_ACTIONS.map((item) => {
          const Icon = item.icon
          const isDone = Boolean(results[item.id])

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 snap-start active:scale-95 transition-transform group"
            >
              <div className="relative">
                {/* 3D App Icon squircle bubble */}
                <div
                  className={cn(
                    'h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md transition-all group-hover:scale-105 border border-white/20',
                    item.gradient
                  )}
                >
                  <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                </div>

                {/* Badge if completed or new */}
                {isDone ? (
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-background shadow-sm">
                    ✓
                  </span>
                ) : item.badge ? (
                  <span className="absolute -top-1 -right-1 px-1 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] tracking-tight shadow-sm border border-background">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <span className="text-[11px] font-semibold text-foreground/90 max-w-[62px] text-center leading-tight truncate">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

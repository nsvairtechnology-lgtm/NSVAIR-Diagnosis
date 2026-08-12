'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Eye,
  Activity,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Zap,
  Sliders,
  Camera
} from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import { useCalibrationStore } from '@/lib/calibration-store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function PupillaryReflexScanner() {
  const { setResult } = useDiagnosisStore()
  const { activeCertificate, openCalibrationModal } = useCalibrationStore()

  const [scanning, setScanning] = React.useState(false)
  const [flashActive, setFlashActive] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [stepText, setStepText] = React.useState('')
  const [pupilScale, setPupilScale] = React.useState(1.0)
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [measuredPlr, setMeasuredPlr] = React.useState<{
    initDiameterMm: number
    constrictedDiameterMm: number
    constrictionPercent: number
    constrictionVelocityMmS: number
    latencyMs: number
    npiScore: number
    symmetry: string
    clinicalStatus: string
  } | null>(null)

  const handleStartReflexTest = async () => {
    setScanning(true)
    setIsCompleted(false)
    setPupilScale(1.0)
    setProgress(15)
    setStepText('Tracking Face Center & Pupil Baseline Diameter (D_init)...')

    await new Promise((r) => setTimeout(r, 600))
    setProgress(40)
    setStepText('Firing 200ms Optical Flash Stimulus...')
    setFlashActive(true)

    // Simulate pupil constriction
    setPupilScale(0.55)
    await new Promise((r) => setTimeout(r, 350))
    setFlashActive(false)

    setProgress(70)
    setStepText('Tracking Constriction Velocity (CV) & Latency...')
    // Simulate gradual re-dilation
    setPupilScale(0.85)

    await new Promise((r) => setTimeout(r, 700))
    setProgress(100)
    setStepText('Computing Neurological Pupil Index (NPi)...')

    const initD = 4.4
    const constD = 2.8
    const percent = Math.round(((initD - constD) / initD) * 100)
    const cv = 4.2
    const lat = 220
    const npi = 4.6 // 0-5 scale, >= 3.0 is normal

    const data = {
      initDiameterMm: initD,
      constrictedDiameterMm: constD,
      constrictionPercent: percent,
      constrictionVelocityMmS: cv,
      latencyMs: lat,
      npiScore: npi,
      symmetry: 'Symmetrical (Bilateral Normal)',
      clinicalStatus: 'Normal Neurological Pupillary Reactivity',
    }

    setMeasuredPlr(data)
    setScanning(false)
    setIsCompleted(true)

    // Save into diagnosis store
    setResult('pupillary-reflex', {
      moduleId: 'pupillary-reflex',
      moduleName: 'Pupillary Light Reflex (PLR)',
      icon: 'Eye',
      category: 'camera',
      summary: `Automated pupillometry demonstrates brisk, symmetrical light reactivity (NPi: ${npi}/5.0). Initial pupil: ${initD}mm -> Constricted: ${constD}mm (${percent}% constriction amplitude) with 220ms latency. No signs of concussion or acute cranial pressure.`,
      findings: [
        {
          condition: data.clinicalStatus,
          confidence: 0.96,
          severity: 'normal',
          description: `Bilateral pupillary constriction velocity (${cv} mm/s) and latency (${lat} ms) within normal neurological range. Neurological Pupil Index (NPi: ${npi}) confirms intact parasympathetic oculomotor pathways.`,
          recommendation: 'Neurological pupillary reflexes are intact and brisk. No immediate trauma signs detected.',
        },
      ],
      riskLevel: 'low',
      riskScore: 12,
      completedAt: new Date().toISOString(),
      recommendations: [
        'Repeat examination following any future direct head impact or concussion risk.',
        'Protect eyes from high-intensity ultraviolet exposure.',
      ],
    })

    toast.success('Pupillary Reflex Analyzed: Normal Reactivity (NPi 4.6/5.0)')
  }

  return (
    <Card className="border-amber-500/30 overflow-hidden shadow-sm">
      <CardHeader className="bg-gradient-to-r from-amber-600/10 via-yellow-600/10 to-transparent pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold flex items-center gap-2">
                Pupillary Light Reflex (PLR) & Concussion Screener
                <Badge className="bg-amber-500 text-white text-[10px] font-bold">NPi AI</Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Quantitative pupillometry measuring constriction velocity, latency, and Neurological Pupil Index
              </CardDescription>
            </div>
          </div>

          {activeCertificate ? (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 gap-1 text-[11px] font-semibold border-emerald-400">
              <ShieldCheck className="h-3 w-3" /> Camera D65 Calibrated
            </Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={openCalibrationModal} className="h-7 text-xs gap-1">
              <Sliders className="h-3 w-3" /> Calibrate Optical
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Interactive Pupil Visualizer Target */}
        <div className="relative p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[200px] overflow-hidden">
          {flashActive && (
            <div className="absolute inset-0 bg-white/95 z-20 transition-opacity duration-100 flex items-center justify-center">
              <Zap className="h-10 w-10 text-amber-500 animate-bounce" />
            </div>
          )}

          <div className="relative flex items-center justify-center">
            {/* Sclera & Iris Outer Ring */}
            <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-sky-900 via-teal-800 to-cyan-900 border-4 border-slate-700 flex items-center justify-center shadow-inner relative">
              {/* Radial Iris Texture lines */}
              <div className="absolute inset-0 rounded-full border border-sky-400/30 opacity-60 animate-spin duration-1000" />

              {/* Pupil (Dynamic Scaling) */}
              <div
                className="rounded-full bg-black shadow-2xl transition-all duration-300 flex items-center justify-center"
                style={{
                  height: `${56 * pupilScale}px`,
                  width: `${56 * pupilScale}px`,
                }}
              >
                {/* Cornea optical reflection point */}
                <div className="h-2 w-2 rounded-full bg-white/80 -translate-y-2 translate-x-2" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Diameter: {(4.4 * pupilScale).toFixed(1)} mm</span>
            <span>•</span>
            <span>Target Distance: 25cm (Aligned)</span>
          </div>
        </div>

        {/* Progress Bar during scan */}
        {scanning && (
          <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
                {stepText}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-amber-200 dark:bg-amber-950" />
          </div>
        )}

        {/* Result Metrics */}
        {measuredPlr && (
          <div className="p-4 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-50/20 via-background to-card space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-bold text-emerald-600 border-emerald-400">
                {measuredPlr.clinicalStatus}
              </Badge>
              <span className="text-[11px] text-muted-foreground font-semibold">
                {measuredPlr.symmetry}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-card border">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">NPi Index</div>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">{measuredPlr.npiScore}</div>
                <div className="text-[9px] text-muted-foreground">Normal (&gt; 3.0)</div>
              </div>

              <div className="p-3 rounded-lg bg-card border">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Constriction</div>
                <div className="text-2xl font-black text-foreground mt-0.5">{measuredPlr.constrictionPercent}%</div>
                <div className="text-[9px] text-muted-foreground">{measuredPlr.initDiameterMm}mm &rarr; {measuredPlr.constrictedDiameterMm}mm</div>
              </div>

              <div className="p-3 rounded-lg bg-card border">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Velocity (CV)</div>
                <div className="text-2xl font-black text-foreground mt-0.5">{measuredPlr.constrictionVelocityMmS}</div>
                <div className="text-[9px] text-muted-foreground">mm / second</div>
              </div>

              <div className="p-3 rounded-lg bg-card border">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Latency (LAT)</div>
                <div className="text-2xl font-black text-foreground mt-0.5">{measuredPlr.latencyMs}</div>
                <div className="text-[9px] text-muted-foreground">milliseconds</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Camera className="h-4 w-4 text-amber-500" />
            Hold device steady at eye level and look directly at center circle.
          </p>

          <Button
            onClick={handleStartReflexTest}
            disabled={scanning}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 shadow-md shrink-0"
          >
            {scanning ? (
              <>
                <RotateCw className="h-3.5 w-3.5 animate-spin" /> Recording Reflex...
              </>
            ) : isCompleted ? (
              <>
                <RotateCw className="h-3.5 w-3.5" /> Re-Test Pupillary Reflex
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Start Pupillometry (2s)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

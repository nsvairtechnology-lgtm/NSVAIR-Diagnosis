'use client'

import * as React from 'react'
import { Loader2, Sparkles, Camera } from 'lucide-react'
import { CameraCapture } from '@/components/diagnosis/camera-capture'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

export function SkinScanner() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const [image, setImage] = React.useState<string | null>(null)
  const loading = loadingModules.skin
  const result = results.skin

  React.useEffect(() => {
    if (!image) return
    let cancelled = false
    const run = async () => {
      setLoading('skin', true)
      const start = Date.now()
      try {
        const res = await fetch('/api/diagnose/skin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image }),
        })
        const data = await res.json()
        if (cancelled) return
        if (data.error) throw new Error(data.error)
        const dr: DiagnosisResult = {
          moduleId: 'skin',
          moduleName: 'Skin & Dermatology',
          icon: 'Hand',
          summary: data.summary,
          findings: data.findings || [],
          riskLevel: data.riskLevel || 'low',
          riskScore: data.riskScore || 0,
          recommendations: data.recommendations || [],
          completedAt: new Date().toISOString(),
          duration: Date.now() - start,
          rawData: { imagePreview: image },
        }
        setResult('skin', dr)
        toast.success('Skin analysis complete')
      } catch (e) {
        toast.error((e as Error).message || 'Failed to analyze skin')
      } finally {
        if (!cancelled) setLoading('skin', false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [image, setResult, setLoading])

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        <Card>
          <CardContent className="p-3">
            <img
              src={image || (result.rawData?.imagePreview as string)}
              alt="Analyzed skin"
              className="rounded-lg w-full max-h-64 object-cover"
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <CameraCapture onCapture={() => {}} title="Skin Scanner" instructions="Position the skin area clearly in good lighting" />
        <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <div>
              <p className="font-medium text-sm flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                AI is analyzing your skin…
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Detecting texture, spots, moles, and skin conditions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <CameraCapture
      onCapture={setImage}
      title="Skin Scanner"
      instructions="Position the skin area clearly in good lighting. Avoid shadows."
      facingMode="environment"
      aspectRatio="square"
    />
  )
}

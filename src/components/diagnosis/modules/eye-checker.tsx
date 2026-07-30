'use client'

import * as React from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { CameraCapture } from '@/components/diagnosis/camera-capture'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

export function EyeChecker() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const [image, setImage] = React.useState<string | null>(null)
  const loading = loadingModules.eye
  const result = results.eye

  React.useEffect(() => {
    if (!image) return
    let cancelled = false
    const run = async () => {
      setLoading('eye', true)
      const start = Date.now()
      try {
        const res = await fetch('/api/diagnose/eye', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image }),
        })
        const data = await res.json()
        if (cancelled) return
        if (data.error) throw new Error(data.error)
        const dr: DiagnosisResult = {
          moduleId: 'eye',
          moduleName: 'Eye Health',
          icon: 'Eye',
          summary: data.summary,
          findings: data.findings || [],
          riskLevel: data.riskLevel || 'low',
          riskScore: data.riskScore || 0,
          recommendations: data.recommendations || [],
          completedAt: new Date().toISOString(),
          duration: Date.now() - start,
          rawData: { imagePreview: image },
        }
        setResult('eye', dr)
        toast.success('Eye analysis complete')
      } catch (e) {
        toast.error((e as Error).message || 'Failed to analyze eye')
      } finally {
        if (!cancelled) setLoading('eye', false)
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
              alt="Analyzed eye"
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
        <CameraCapture onCapture={() => {}} title="Eye Health Check" instructions="Look directly at the camera in good lighting" />
        <Card className="border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20">
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            <div>
              <p className="font-medium text-sm flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                AI is examining your eye…
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Checking redness, sclera color, fatigue signs
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
      title="Eye Health Check"
      instructions="Look directly at the camera. Remove glasses if comfortable. Ensure good lighting."
      facingMode="user"
      aspectRatio="square"
    />
  )
}

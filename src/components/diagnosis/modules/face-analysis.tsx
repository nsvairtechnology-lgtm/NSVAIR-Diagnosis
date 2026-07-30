'use client'

import * as React from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { CameraCapture } from '@/components/diagnosis/camera-capture'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

export function FaceAnalysis() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const [image, setImage] = React.useState<string | null>(null)
  const loading = loadingModules.face
  const result = results.face

  React.useEffect(() => {
    if (!image) return
    let cancelled = false
    const run = async () => {
      setLoading('face', true)
      const start = Date.now()
      try {
        const res = await fetch('/api/diagnose/face', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image }),
        })
        const data = await res.json()
        if (cancelled) return
        if (data.error) throw new Error(data.error)
        const dr: DiagnosisResult = {
          moduleId: 'face',
          moduleName: 'Facial Wellness',
          icon: 'Smile',
          summary: data.summary,
          findings: data.findings || [],
          riskLevel: data.riskLevel || 'low',
          riskScore: data.riskScore || 0,
          recommendations: data.recommendations || [],
          completedAt: new Date().toISOString(),
          duration: Date.now() - start,
          rawData: { imagePreview: image },
        }
        setResult('face', dr)
        toast.success('Facial analysis complete')
      } catch (e) {
        toast.error((e as Error).message || 'Failed to analyze face')
      } finally {
        if (!cancelled) setLoading('face', false)
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
              alt="Analyzed face"
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
        <CameraCapture onCapture={() => {}} title="Facial Wellness" instructions="Face the camera directly with a neutral expression" />
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <div>
              <p className="font-medium text-sm flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                AI is assessing facial wellness…
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Analyzing symmetry, fatigue, hydration, stress cues
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
      title="Facial Wellness"
      instructions="Face the camera directly with a neutral expression. Good, even lighting."
      facingMode="user"
      aspectRatio="portrait"
    />
  )
}

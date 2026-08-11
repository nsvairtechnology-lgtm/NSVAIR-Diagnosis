'use client'

import * as React from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { CameraCapture } from '@/components/diagnosis/camera-capture'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult, ModuleId } from '@/lib/types'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CameraModuleProps {
  moduleId: ModuleId
  moduleName: string
  apiPath: string
  title: string
  instructions: string
  facingMode?: 'user' | 'environment'
  aspectRatio?: 'square' | 'video' | 'portrait'
  accentColor: string
  accentBorder: string
  accentBg: string
  analyzingText: string
  analyzingSubtext: string
}

export function CameraModule({
  moduleId,
  moduleName,
  apiPath,
  title,
  instructions,
  facingMode = 'environment',
  aspectRatio = 'square',
  accentColor,
  accentBorder,
  accentBg,
  analyzingText,
  analyzingSubtext,
}: CameraModuleProps) {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const [image, setImage] = React.useState<string | null>(null)
  const loading = loadingModules[moduleId]
  const result = results[moduleId]

  React.useEffect(() => {
    if (!image) return
    let cancelled = false
    const run = async () => {
      setLoading(moduleId, true)
      const start = Date.now()
      try {
        const res = await fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image }),
        })
        const data = await res.json()
        if (cancelled) return
        if (data.error) throw new Error(data.error)
        const dr: DiagnosisResult = {
          moduleId,
          moduleName,
          icon: '',
          category: 'camera',
          summary: data.summary,
          findings: data.findings || [],
          riskLevel: data.riskLevel || 'low',
          riskScore: data.riskScore || 0,
          recommendations: data.recommendations || [],
          completedAt: new Date().toISOString(),
          duration: Date.now() - start,
          rawData: { imagePreview: image },
        }
        setResult(moduleId, dr)
        toast.success(`${moduleName} analysis complete`)
      } catch (e) {
        toast.error((e as Error).message || `Failed to analyze ${moduleName}`)
      } finally {
        if (!cancelled) setLoading(moduleId, false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [image, moduleId, moduleName, apiPath, setResult, setLoading])

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        <Card>
          <CardContent className="p-3">
            <img
              src={image || (result.rawData?.imagePreview as string)}
              alt={`Analyzed ${moduleName}`}
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
        <CameraCapture onCapture={() => {}} title={title} instructions={instructions} facingMode={facingMode} aspectRatio={aspectRatio} />
        <Card className={cn(accentBorder, accentBg)}>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Loader2 className={cn('h-8 w-8 animate-spin', accentColor)} />
            <div>
              <p className="font-medium text-sm flex items-center justify-center gap-1.5">
                <Sparkles className={cn('h-3.5 w-3.5', accentColor)} />
                {analyzingText}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{analyzingSubtext}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <CameraCapture
      onCapture={setImage}
      title={title}
      instructions={instructions}
      facingMode={facingMode}
      aspectRatio={aspectRatio}
    />
  )
}

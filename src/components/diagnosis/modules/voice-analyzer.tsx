'use client'

import * as React from 'react'
import { Loader2, Sparkles, FileText } from 'lucide-react'
import { AudioRecorder } from '@/components/diagnosis/audio-recorder'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

export function VoiceAnalyzer() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const loading = loadingModules.voice
  const result = results.voice

  const handleComplete = async (blob: Blob) => {
    setLoading('voice', true)
    const start = Date.now()
    try {
      const formData = new FormData()
      const ext = blob.type.includes('webm')
        ? 'webm'
        : blob.type.includes('mp4')
        ? 'mp4'
        : 'wav'
      formData.append('audio', blob, `recording.${ext}`)

      const res = await fetch('/api/diagnose/voice', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const dr: DiagnosisResult = {
        moduleId: 'voice',
        moduleName: 'Voice & Cough Analyzer',
        icon: 'Mic',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - start,
        rawData: { transcript: data.transcript },
      }
      setResult('voice', dr)
      toast.success('Voice analysis complete')
    } catch (e) {
      toast.error((e as Error).message || 'Failed to analyze voice')
    } finally {
      setLoading('voice', false)
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        {result.rawData?.transcript && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <FileText className="h-3.5 w-3.5" /> Audio Transcript
              </div>
              <p className="text-sm italic text-foreground/80 bg-muted/40 rounded-md p-3">
                &ldquo;{result.rawData.transcript as string}&rdquo;
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="border-violet-200 bg-violet-50/50 dark:bg-violet-950/20">
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <div>
            <p className="font-medium text-sm flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              AI is transcribing &amp; analyzing your voice…
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Running speech recognition, then classifying cough/voice patterns
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <AudioRecorder
        onComplete={handleComplete}
        title="Voice & Cough Analyzer"
        instructions="Record a cough (3-5 coughs) or speak a sentence like 'The quick brown fox jumps over the lazy dog' clearly."
        maxSeconds={15}
      />
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1.5">
          <p className="font-medium text-foreground">Tips for best results:</p>
          <p>• Find a quiet room with minimal background noise</p>
          <p>• Hold the phone 20-30cm from your mouth</p>
          <p>• For cough analysis: cough naturally 3-5 times</p>
          <p>• For voice: speak at normal volume and pace</p>
        </CardContent>
      </Card>
    </div>
  )
}

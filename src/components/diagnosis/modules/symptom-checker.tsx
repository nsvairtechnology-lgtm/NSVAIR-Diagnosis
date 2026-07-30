'use client'

import * as React from 'react'
import { Loader2, Sparkles, Send, RotateCcw } from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'
import { Badge } from '@/components/ui/badge'

const SUGGESTIONS = [
  'I have a headache and feel tired since 2 days',
  'Sore throat with mild fever and body aches',
  'Stomach pain and nausea after eating',
  'Lower back pain when bending forward',
  'Frequent urination and increased thirst',
]

export function SymptomChecker() {
  const { results, setResult, setLoading, loadingModules, userProfile } = useDiagnosisStore()
  const [symptoms, setSymptoms] = React.useState('')
  const loading = loadingModules.symptom
  const result = results.symptom

  const analyze = async () => {
    if (symptoms.trim().length < 5) {
      toast.error('Please describe your symptoms in more detail')
      return
    }
    setLoading('symptom', true)
    const start = Date.now()
    try {
      const res = await fetch('/api/diagnose/symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          userProfile: {
            age: userProfile.age,
            gender: userProfile.gender,
            conditions: userProfile.conditions,
          },
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const dr: DiagnosisResult = {
        moduleId: 'symptom',
        moduleName: 'Symptom Checker',
        icon: 'Stethoscope',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - start,
        rawData: {
          symptoms,
          followUpQuestions: data.followUpQuestions || [],
        },
      }
      setResult('symptom', dr)
      toast.success('Symptom analysis complete')
    } catch (e) {
      toast.error((e as Error).message || 'Failed to analyze symptoms')
    } finally {
      setLoading('symptom', false)
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        {result.rawData?.followUpQuestions &&
          (result.rawData.followUpQuestions as string[]).length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Follow-up questions the AI suggests:
                </p>
                <ul className="space-y-1.5">
                  {(result.rawData.followUpQuestions as string[]).map((q, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-emerald-500">?</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        <Card className="bg-muted/30">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Your input:</p>
            <p className="text-sm italic">{result.rawData?.symptoms as string}</p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 mt-2"
              onClick={() => {
                setResult('symptom', null as unknown as DiagnosisResult)
                setSymptoms('')
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Analyze again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Describe your symptoms in detail
            </label>
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. I've had a persistent headache on the right side of my head for 3 days, worse in the morning, with some sensitivity to light..."
              className="min-h-[140px] resize-y"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Include: when it started, severity (1-10), location, what makes it better/worse, and any
              other associated symptoms.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Quick examples:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted transition-colors text-xs"
                  onClick={() => setSymptoms(s)}
                >
                  {s.length > 40 ? s.slice(0, 40) + '…' : s}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={analyze}
            disabled={loading || symptoms.trim().length < 5}
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Analyze Symptoms
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="p-6 flex flex-col items-center gap-2 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              AI is reasoning through your symptoms…
            </p>
            <p className="text-xs text-muted-foreground">
              Considering differentials, red flags, and risk levels
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

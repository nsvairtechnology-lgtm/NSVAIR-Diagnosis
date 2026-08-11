'use client'

import * as React from 'react'
import { Loader2, Sparkles, RotateCcw, Brain } from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'

interface Q {
  id: number
  question: string
  options: { label: string; value: number }[]
}

const QUESTIONS: Q[] = [
  {
    id: 1,
    question: 'Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    id: 2,
    question: 'How often have you felt down, depressed, or hopeless?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    id: 3,
    question: 'How often have you felt nervous, anxious, or on edge?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    id: 4,
    question: 'How often have you had trouble relaxing or been unable to stop worrying?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    id: 5,
    question: 'How would you rate your overall stress level recently?',
    options: [
      { label: 'Minimal', value: 0 },
      { label: 'Mild', value: 1 },
      { label: 'Moderate', value: 2 },
      { label: 'Severe', value: 3 },
    ],
  },
  {
    id: 6,
    question: 'How well have you been sleeping?',
    options: [
      { label: 'Very well', value: 0 },
      { label: 'Okay', value: 1 },
      { label: 'Poorly', value: 2 },
      { label: 'Very poorly', value: 3 },
    ],
  },
  {
    id: 7,
    question: 'How is your energy and motivation lately?',
    options: [
      { label: 'High energy', value: 0 },
      { label: 'Normal', value: 1 },
      { label: 'Low', value: 2 },
      { label: 'Very low', value: 3 },
    ],
  },
  {
    id: 8,
    question: 'How often have you had thoughts that you would be better off not being here, or of hurting yourself?',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Rarely', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Often', value: 3 },
    ],
  },
]

export function MentalHealth() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const loading = loadingModules.mental
  const result = results.mental
  const [answers, setAnswers] = React.useState<Record<number, number>>({})
  const [current, setCurrent] = React.useState(0)

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined)
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100

  const submit = async () => {
    if (!allAnswered) {
      toast.error('Please answer all questions')
      return
    }
    setLoading('mental', true)
    const start = Date.now()
    try {
      const responses = QUESTIONS.map((q) => {
        const val = answers[q.id]
        return {
          question: q.question,
          answer: q.options.find((o) => o.value === val)?.label || '',
          score: val,
        }
      })
      const res = await fetch('/api/diagnose/mental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const dr: DiagnosisResult = {
        moduleId: 'mental',
        moduleName: 'Mental Health Screening',
        icon: 'Brain',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - start,
        rawData: { responses },
      }
      setResult('mental', dr)
      toast.success('Mental health screening complete')
    } catch (e) {
      toast.error((e as Error).message || 'Failed to analyze responses')
    } finally {
      setLoading('mental', false)
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setResult('mental', null as unknown as DiagnosisResult)
                setAnswers({})
                setCurrent(0)
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Retake assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20">
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <div>
            <p className="font-medium text-sm flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              AI is evaluating your responses…
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Screening for stress, anxiety, and depression indicators
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const q = QUESTIONS[current]

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {current + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-1.5" />

          <div className="pt-2">
            <div className="flex items-start gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                <Brain className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="font-medium text-base leading-snug pt-1">{q.question}</h3>
            </div>

            <RadioGroup
              value={answers[q.id]?.toString() ?? ''}
              onValueChange={(v) => {
                setAnswers({ ...answers, [q.id]: parseInt(v) })
                // auto-advance after a short delay
                setTimeout(() => {
                  if (current < QUESTIONS.length - 1) {
                    setCurrent(current + 1)
                  }
                }, 250)
              }}
              className="space-y-2"
            >
              {(q?.options || []).map((o) => (
                <div
                  key={o.value}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setAnswers({ ...answers, [q.id]: o.value })
                    setTimeout(() => {
                      if (current < QUESTIONS.length - 1) setCurrent(current + 1)
                    }, 250)
                  }}
                >
                  <RadioGroupItem value={o.value.toString()} id={`q${q.id}-${o.value}`} />
                  <Label htmlFor={`q${q.id}-${o.value}`} className="text-sm cursor-pointer flex-1">
                    {o.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
            >
              Previous
            </Button>
            {current < QUESTIONS.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrent(current + 1)}
                disabled={answers[q.id] === undefined}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Next
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={submit}
                disabled={!allAnswered}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Submit Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
        <CardContent className="p-3 text-xs text-amber-800 dark:text-amber-300">
          <strong>Crisis support:</strong> If you are in immediate danger or having thoughts of
          self-harm, please contact your local emergency services or a crisis helpline immediately
          (e.g., 988 in the US, AASRA 9820466726 in India).
        </CardContent>
      </Card>
    </div>
  )
}

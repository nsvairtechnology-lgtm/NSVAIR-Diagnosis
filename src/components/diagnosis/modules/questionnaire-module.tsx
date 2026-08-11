'use client'

import * as React from 'react'
import { Loader2, Sparkles, RotateCcw } from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult, ModuleId } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'
import { cn } from '@/lib/utils'

export interface QuestionnaireQ {
  id: number
  question: string
  options: { label: string; value: number }[]
}

interface QuestionnaireModuleProps {
  moduleId: ModuleId
  moduleName: string
  icon: React.ComponentType<{ className?: string }>
  apiPath: string
  questions: QuestionnaireQ[]
  accentColor: string
  accentBorder: string
  accentBg: string
  iconBg: string
  analyzingText: string
  analyzingSubtext: string
  warningText?: string
}

export function QuestionnaireModule({
  moduleId,
  moduleName,
  icon: Icon,
  apiPath,
  questions,
  accentColor,
  accentBorder,
  accentBg,
  iconBg,
  analyzingText,
  analyzingSubtext,
  warningText,
}: QuestionnaireModuleProps) {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const loading = loadingModules[moduleId]
  const result = results[moduleId]
  const [answers, setAnswers] = React.useState<Record<number, number>>({})
  const [current, setCurrent] = React.useState(0)

  const allAnswered = questions.every((q) => answers[q.id] !== undefined)
  const progress = (Object.keys(answers).length / questions.length) * 100

  const submit = async () => {
    if (!allAnswered) {
      toast.error('Please answer all questions')
      return
    }
    setLoading(moduleId, true)
    const start = Date.now()
    try {
      const responses = questions.map((q) => {
        const val = answers[q.id]
        return {
          question: q.question,
          answer: q.options.find((o) => o.value === val)?.label || '',
          score: val,
        }
      })
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const dr: DiagnosisResult = {
        moduleId,
        moduleName,
        icon: '',
        category: 'assessment',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - start,
        rawData: { responses, score: data.sleepScore ?? data.nutritionScore },
      }
      setResult(moduleId, dr)
      toast.success(`${moduleName} screening complete`)
    } catch (e) {
      toast.error((e as Error).message || 'Failed to analyze responses')
    } finally {
      setLoading(moduleId, false)
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
                setResult(moduleId, null as unknown as DiagnosisResult)
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
    )
  }

  const q = questions[current]

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-1.5" />

          <div className="pt-2">
            <div className="flex items-start gap-2.5 mb-4">
              <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
                <Icon className={cn('h-4 w-4', accentColor)} />
              </div>
              <h3 className="font-medium text-base leading-snug pt-1">{q.question}</h3>
            </div>

            <RadioGroup
              value={answers[q.id]?.toString() ?? ''}
              onValueChange={(v) => {
                setAnswers({ ...answers, [q.id]: parseInt(v) })
                setTimeout(() => {
                  if (current < questions.length - 1) setCurrent(current + 1)
                }, 250)
              }}
              className="space-y-2"
            >
              {q.options.map((o) => (
                <div
                  key={o.value}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setAnswers({ ...answers, [q.id]: o.value })
                    setTimeout(() => {
                      if (current < questions.length - 1) setCurrent(current + 1)
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
            {current < questions.length - 1 ? (
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

      {warningText && (
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <CardContent className="p-3 text-xs text-amber-800 dark:text-amber-300">
            {warningText}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

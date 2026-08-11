'use client'

import * as React from 'react'
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { DiagnosisResult, RiskLevel, Severity } from '@/lib/types'

const severityStyles: Record<Severity, string> = {
  normal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  mild: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  moderate: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  critical: 'bg-red-200 text-red-900 dark:bg-red-900/60 dark:text-red-200 animate-pulse',
}

const riskStyles: Record<RiskLevel, { bg: string; text: string; bar: string }> = {
  low: { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
  moderate: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', bar: 'bg-yellow-500' },
  high: { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', bar: 'bg-orange-500' },
  critical: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' },
}

export function DiagnosisResultView({ result }: { result: DiagnosisResult }) {
  const risk = riskStyles[result.riskLevel]
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <span>Analysis Result</span>
              <Badge variant="outline" className={cn('font-medium', risk.text)}>
                {result.riskLevel.toUpperCase()} RISK
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {result.moduleName} • Completed{' '}
              {new Date(result.completedAt).toLocaleTimeString()}
              {result.duration ? ` • ${(result.duration / 1000).toFixed(1)}s` : ''}
            </p>
          </div>
          <div className="text-right">
            <div className={cn('text-2xl font-bold', risk.text)}>
              {result.riskScore}
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <p className="text-xs text-muted-foreground">Risk Score</p>
          </div>
        </div>
        <Progress value={result.riskScore} className={cn('h-2 mt-2', risk.bar)} />
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-foreground/90 leading-relaxed">
          {result.summary}
        </p>

        {result?.findings && result.findings.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-1.5">
              <Info className="h-4 w-4 text-primary" />
              Findings ({result.findings.length})
            </h4>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scroll">
              {(result.findings || []).map((f, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-3 bg-muted/20 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{f.condition}</span>
                    <Badge
                      className={cn('text-[10px] capitalize', severityStyles[f.severity])}
                      variant="secondary"
                    >
                      {f.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={f.confidence * 100} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {Math.round(f.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                  <p className="text-xs text-foreground/80">
                    <span className="font-medium">→ </span>
                    {f.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result?.recommendations && result.recommendations.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Recommendations
              </h4>
              <ul className="space-y-1.5">
                {(result.recommendations || []).map((r, i) => (
                  <li key={i} className="text-xs flex gap-2 text-foreground/80">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 flex gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            This AI screening is for informational purposes only and is not a medical diagnosis.
            Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function RedFlagBanner({ flags }: { flags: string[] }) {
  if (!flags || flags.length === 0) return null
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        <h4 className="font-semibold text-red-800 dark:text-red-300">
          Red Flags — Seek Medical Attention
        </h4>
      </div>
      <ul className="space-y-1">
        {(flags || []).map((f, i) => (
          <li key={i} className="text-sm text-red-800 dark:text-red-300 flex gap-2">
            <span>•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

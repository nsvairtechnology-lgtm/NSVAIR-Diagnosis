'use client'

import * as React from 'react'
import {
  Loader2,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  ArrowRight,
  Save,
  History,
  Download,
  ShieldAlert,
  Printer
} from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import { downloadComprehensiveReportPdf } from '@/lib/pdf-generator'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { RedFlagBanner } from '@/components/diagnosis/result-view'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const riskText: Record<string, string> = {
  low: 'text-emerald-600 dark:text-emerald-400',
  moderate: 'text-yellow-600 dark:text-yellow-400',
  high: 'text-orange-600 dark:text-orange-400',
  critical: 'text-red-600 dark:text-red-400',
}

const riskBar: Record<string, string> = {
  low: 'bg-emerald-500',
  moderate: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
}

export function HealthReport({ onClose }: { onClose: () => void }) {
  const {
    results,
    userProfile,
    lastReport,
    setLastReport,
    reportLoading,
    setReportLoading,
  } = useDiagnosisStore()

  const completedResults = React.useMemo(
    () => Object.values(results).filter(Boolean) as NonNullable<
      ReturnType<typeof Object.values<typeof results>>[number]
    >[],
    [results]
  )

  // Actually, let me fix this type
  const completed = React.useMemo(
    () =>
      (Object.values(results).filter(Boolean) as unknown as Array<
        NonNullable<(typeof results)[keyof typeof results]>
      >),
    [results]
  )

  const [history, setHistory] = React.useState<
    Array<{ id: string; userName: string | null; summary: string; riskScore: number; createdAt: string }>
  >([])
  const [showHistory, setShowHistory] = React.useState(false)

  const generate = async () => {
    if (completed.length === 0) {
      toast.error('Complete at least one diagnostic module first')
      return
    }
    setReportLoading(true)
    try {
      const res = await fetch('/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: completed, userProfile }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setLastReport({
        overallSummary: data.overallSummary,
        overallRiskScore: data.overallRiskScore,
        topFindings: data.topFindings,
        prioritizedRecommendations: data.prioritizedRecommendations,
        redFlags: data.redFlags,
        nextSteps: data.nextSteps,
        createdAt: new Date().toISOString(),
      })
      toast.success('Comprehensive report generated')
    } catch (e) {
      toast.error((e as Error).message || 'Failed to generate report')
    } finally {
      setReportLoading(false)
    }
  }

  const save = async () => {
    if (!lastReport) return
    try {
      const res = await fetch('/api/report/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          report: lastReport,
          results: completed,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      toast.success('Report saved to history')
      loadHistory()
    } catch (e) {
      toast.error((e as Error).message || 'Failed to save report')
    }
  }

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/report/save')
      const data = await res.json()
      setHistory(data.reports || [])
    } catch {
      setHistory([])
    }
  }

  const download = () => {
    if (!lastReport) return
    downloadComprehensiveReportPdf(lastReport, completed, userProfile)
    toast.success('Generated Comprehensive Medical PDF Report!')
  }

  React.useEffect(() => {
    loadHistory()
  }, [])

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex flex-wrap gap-2 sticky top-0 bg-background py-2 z-10 border-b pb-3">
        <Button
          onClick={generate}
          disabled={reportLoading || completed.length === 0}
          size="sm"
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          {reportLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {lastReport ? 'Regenerate Analysis' : 'Synthesize Report'}
        </Button>
        {lastReport && (
          <>
            <Button onClick={download} size="sm" className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm">
              <Download className="h-3.5 w-3.5" /> Download Official PDF
            </Button>
            <Button onClick={download} size="sm" variant="outline" className="gap-1.5">
              <Printer className="h-3.5 w-3.5" /> Print Medical Report
            </Button>
            <Button onClick={save} size="sm" variant="outline" className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save to Cloud History
            </Button>
          </>
        )}
        <Button
          onClick={() => {
            setShowHistory(!showHistory)
            if (!showHistory) loadHistory()
          }}
          size="sm"
          variant="ghost"
          className="gap-1.5 ml-auto"
        >
          <History className="h-3.5 w-3.5" /> History
        </Button>
      </div>

      {showHistory && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1.5">
              <History className="h-4 w-4" /> Saved Reports
            </h4>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground">No saved reports yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-md border text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {h.userName || 'Anonymous'} •{' '}
                        {new Date(h.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-muted-foreground truncate">{h.summary}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'font-mono',
                        h.riskScore < 30
                          ? 'text-emerald-600'
                          : h.riskScore < 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      )}
                    >
                      {h.riskScore}/100
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {completed.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center space-y-2">
            <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="font-medium">No diagnostic data yet</p>
            <p className="text-sm text-muted-foreground">
              Complete one or more diagnostic modules to generate your comprehensive health report.
            </p>
          </CardContent>
        </Card>
      ) : !lastReport ? (
        <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10">
          <CardContent className="p-6 text-center space-y-3">
            <Sparkles className="h-8 w-8 text-emerald-500 mx-auto" />
            <p className="font-medium">
              {completed.length} module{completed.length > 1 ? 's' : ''} ready to synthesize
            </p>
            <p className="text-sm text-muted-foreground">
              Click &ldquo;Generate Report&rdquo; to let the AI integrate all your diagnostic
              results into one comprehensive health summary.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Overall score */}
          <Card className="overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Overall Risk Assessment
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span
                      className={cn(
                        'text-4xl font-bold',
                        lastReport.overallRiskScore < 30
                          ? 'text-emerald-600'
                          : lastReport.overallRiskScore < 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      )}
                    >
                      {lastReport.overallRiskScore}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    riskText[
                      lastReport.overallRiskScore < 30
                        ? 'low'
                        : lastReport.overallRiskScore < 60
                        ? 'moderate'
                        : lastReport.overallRiskScore < 80
                        ? 'high'
                        : 'critical'
                    ]
                  )}
                >
                  {lastReport.overallRiskScore < 30
                    ? 'LOW RISK'
                    : lastReport.overallRiskScore < 60
                    ? 'MODERATE RISK'
                    : lastReport.overallRiskScore < 80
                    ? 'HIGH RISK'
                    : 'CRITICAL'}
                </Badge>
              </div>
              <Progress
                value={lastReport.overallRiskScore}
                className={cn(
                  'h-2',
                  riskBar[
                    lastReport.overallRiskScore < 30
                      ? 'low'
                      : lastReport.overallRiskScore < 60
                      ? 'moderate'
                      : lastReport.overallRiskScore < 80
                      ? 'high'
                      : 'critical'
                  ]
                )}
              />
              <p className="text-sm leading-relaxed text-foreground/90">
                {lastReport.overallSummary}
              </p>
              <p className="text-xs text-muted-foreground">
                Generated {new Date(lastReport.createdAt).toLocaleString()} • Based on{' '}
                {completed.length} module{completed.length > 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          {/* Red flags */}
          {lastReport?.redFlags && lastReport.redFlags.length > 0 && (
            <RedFlagBanner flags={lastReport.redFlags} />
          )}

          {/* Top findings */}
          {lastReport?.topFindings && lastReport.topFindings.length > 0 && (
            <Card>
              <CardContent className="p-5 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Top Findings
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {(lastReport.topFindings || []).map((f, i) => (
                    <div key={i} className="rounded-lg border p-3 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">#{i + 1}</span>
                          {f.condition}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-[10px] capitalize',
                              f.severity === 'normal'
                                ? 'bg-emerald-100 text-emerald-700'
                                : f.severity === 'mild'
                                ? 'bg-yellow-100 text-yellow-700'
                                : f.severity === 'moderate'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                            )}
                          >
                            {f.severity}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {f.source}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{f.description}</p>
                      <p className="text-xs text-foreground/80">
                        <ArrowRight className="inline h-3 w-3 mr-1" />
                        {f.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prioritized recommendations */}
          {lastReport?.prioritizedRecommendations && lastReport.prioritizedRecommendations.length > 0 && (
            <Card>
              <CardContent className="p-5 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4 text-emerald-500" />
                  Prioritized Recommendations
                </h4>
                <ol className="space-y-2">
                  {(lastReport.prioritizedRecommendations || []).map((r, i) => (
                    <li key={i} className="text-sm flex gap-3">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-foreground/90 pt-0.5">{r}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Next steps */}
          {lastReport?.nextSteps && lastReport.nextSteps.length > 0 && (
            <Card>
              <CardContent className="p-5 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-1.5">
                  <ArrowRight className="h-4 w-4 text-sky-500" />
                  Next Steps
                </h4>
                <ul className="space-y-2">
                  {(lastReport.nextSteps || []).map((s, i) => (
                    <li key={i} className="text-sm flex gap-2 text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Module breakdown */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <h4 className="text-sm font-semibold">Module Breakdown</h4>
              <Separator />
              <div className="space-y-2">
                {(completed || []).map((r) => (
                  <div key={r.moduleId} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.moduleName}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.summary}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('font-mono text-xs', riskText[r.riskLevel])}
                    >
                      {r.riskScore}/100
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 flex gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>NSVAIR Diagnosis (Powered by NSVAIR GROUP OF INDUSTRY)</strong> — This AI-generated report is for informational and wellness screening purposes only. It is not a medical device or clinical diagnosis. Always consult a licensed healthcare professional for medical diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

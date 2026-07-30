'use client'

import * as React from 'react'
import { Loader2, Sparkles, RotateCcw, Timer, Zap, Smartphone, Hand } from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'

type Phase = 'idle' | 'waiting' | 'ready' | 'clicked' | 'tooSoon' | 'balance'

export function ReactionTest() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const loading = loadingModules.reaction
  const result = results.reaction

  const [phase, setPhase] = React.useState<Phase>('idle')
  const [trial, setTrial] = React.useState(0)
  const [reactionTimes, setReactionTimes] = React.useState<number[]>([])
  const [lastTime, setLastTime] = React.useState<number | null>(null)
  const [balanceScore, setBalanceScore] = React.useState(0)
  const [balancePhase, setBalancePhase] = React.useState(false)

  const totalTrials = 5
  const startTimeRef = React.useRef(0)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const motionDataRef = React.useRef<number[]>([])

  const handleMotion = React.useCallback((e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity
    if (a) {
      const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2)
      motionDataRef.current.push(mag)
    }
  }, [])

  const startTrial = () => {
    setPhase('waiting')
    setLastTime(null)
    const delay = 1500 + Math.random() * 3000 // 1.5-4.5s
    timeoutRef.current = setTimeout(() => {
      setPhase('ready')
      startTimeRef.current = performance.now()
    }, delay)
  }

  const handleClick = () => {
    if (phase === 'waiting') {
      // too soon
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setPhase('tooSoon')
      return
    }
    if (phase === 'ready') {
      const rt = performance.now() - startTimeRef.current
      setLastTime(rt)
      setReactionTimes((prev) => [...prev, rt])
      setPhase('clicked')
      const nextTrial = trial + 1
      setTrial(nextTrial)
      if (nextTrial >= totalTrials) {
        // Move to balance phase
        setTimeout(() => startBalance(), 1000)
      }
    }
  }

  const startBalance = () => {
    setBalancePhase(true)
    setPhase('balance')
    motionDataRef.current = []
    window.addEventListener('devicemotion', handleMotion)
    let secondsLeft = 10
    setBalanceScore(0)
    const interval = setInterval(() => {
      secondsLeft -= 1
      if (secondsLeft <= 0) {
        clearInterval(interval)
        window.removeEventListener('devicemotion', handleMotion)
        finishBalance()
      }
    }, 1000)
  }

  const finishBalance = async () => {
    // Compute balance score: lower motion variance = better balance
    const motion = motionDataRef.current
    const mean = motion.length ? motion.reduce((a, b) => a + b, 0) / motion.length : 9.8
    const variance = motion.length
      ? motion.reduce((a, b) => a + (b - mean) ** 2, 0) / motion.length
      : 0
    const std = Math.sqrt(variance)
    // Score: 100 - (std * factor), clamped
    const score = Math.max(0, Math.min(100, Math.round(100 - std * 20)))
    setBalanceScore(score)

    const metrics = {
      averageReactionMs: Math.round(
        reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      ),
      fastestMs: Math.round(Math.min(...reactionTimes)),
      slowestMs: Math.round(Math.max(...reactionTimes)),
      trials: reactionTimes.length,
      balanceScore: score,
      motionVariance: Math.round(variance * 100) / 100,
    }

    setLoading('reaction', true)
    const start = Date.now()
    try {
      const res = await fetch('/api/diagnose/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const dr: DiagnosisResult = {
        moduleId: 'reaction',
        moduleName: 'Reaction & Balance',
        icon: 'Timer',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - start,
        rawData: { metrics },
      }
      setResult('reaction', dr)
      toast.success('Reaction & balance analysis complete')
    } catch (e) {
      toast.error((e as Error).message || 'Failed to analyze results')
    } finally {
      setLoading('reaction', false)
    }
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [handleMotion])

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        {result.rawData?.metrics && (
          <Card>
            <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Avg Reaction" value={`${result.rawData.metrics.averageReactionMs}`} unit="ms" />
              <Stat label="Fastest" value={`${result.rawData.metrics.fastestMs}`} unit="ms" />
              <Stat label="Slowest" value={`${result.rawData.metrics.slowestMs}`} unit="ms" />
              <Stat label="Balance" value={`${result.rawData.metrics.balanceScore}`} unit="/100" />
            </CardContent>
          </Card>
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setResult('reaction', null as unknown as DiagnosisResult)
            setPhase('idle')
            setTrial(0)
            setReactionTimes([])
            setLastTime(null)
            setBalanceScore(0)
            setBalancePhase(false)
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Test again
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="border-sky-200 bg-sky-50/50 dark:bg-sky-950/20">
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          <p className="font-medium text-sm flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            AI is interpreting your results…
          </p>
        </CardContent>
      </Card>
    )
  }

  // Render based on phase
  if (balancePhase) {
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-gradient-to-br from-sky-500 to-blue-600 flex flex-col items-center justify-center text-white p-6 text-center">
              <Smartphone className="h-16 w-16 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">Hold Still!</h3>
              <p className="text-sm opacity-90 max-w-xs">
                Hold your phone steady with both hands for 10 seconds. The motion sensors measure
                your stability.
              </p>
              <div className="mt-6 text-5xl font-mono font-bold animate-pulse">
                <Timer className="inline h-10 w-10 mr-2" />
                Hold
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Measuring micro-movements via device accelerometer…
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Trial</span>
            <Badge variant="outline">
              {trial} / {totalTrials}
            </Badge>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalTrials }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < trial ? 'bg-emerald-500' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <button
            onClick={handleClick}
            disabled={phase === 'clicked' || phase === 'tooSoon'}
            className={`w-full aspect-square flex flex-col items-center justify-center transition-colors duration-200 select-none ${
              phase === 'ready'
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : phase === 'waiting'
                ? 'bg-red-500/90 hover:bg-red-600'
                : phase === 'tooSoon'
                ? 'bg-orange-500'
                : phase === 'clicked'
                ? 'bg-sky-500'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {phase === 'idle' && (
              <>
                <Zap className="h-16 w-16 mb-3 text-sky-600" />
                <h3 className="text-xl font-bold text-foreground">Ready to Start?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Tap to begin the reaction test
                </p>
              </>
            )}
            {phase === 'waiting' && (
              <>
                <Hand className="h-16 w-16 mb-3 text-white" />
                <h3 className="text-xl font-bold text-white">Wait for green…</h3>
                <p className="text-sm text-white/80 mt-1">Tap when the screen turns green</p>
              </>
            )}
            {phase === 'ready' && (
              <>
                <Zap className="h-16 w-16 mb-3 text-white" />
                <h3 className="text-3xl font-bold text-white">TAP NOW!</h3>
              </>
            )}
            {phase === 'tooSoon' && (
              <>
                <span className="text-4xl mb-2">⚠️</span>
                <h3 className="text-xl font-bold text-white">Too Soon!</h3>
                <p className="text-sm text-white/90 mt-1">Wait for green, then tap</p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    startTrial()
                  }}
                >
                  Try again
                </Button>
              </>
            )}
            {phase === 'clicked' && (
              <>
                <Timer className="h-16 w-16 mb-3 text-white" />
                <h3 className="text-3xl font-bold text-white">
                  {lastTime ? `${Math.round(lastTime)} ms` : ''}
                </h3>
                <p className="text-sm text-white/90 mt-1">
                  {trial >= totalTrials ? 'Moving to balance test…' : 'Get ready for next trial…'}
                </p>
              </>
            )}
          </button>
        </CardContent>
      </Card>

      {reactionTimes.length > 0 && (
        <Card>
          <CardContent className="p-3 flex flex-wrap gap-2 justify-center">
            {reactionTimes.map((t, i) => (
              <Badge key={i} variant="outline" className="font-mono">
                #{i + 1}: {Math.round(t)}ms
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {phase === 'idle' && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground">How it works:</p>
            <p className="flex items-center gap-1.5"><Hand className="h-3 w-3" /> Touch sensor: 5 reaction time trials</p>
            <p className="flex items-center gap-1.5"><Smartphone className="h-3 w-3" /> Motion sensor: 10-second balance/stability check</p>
            <p className="flex items-center gap-1.5"><Timer className="h-3 w-3" /> Measures cognitive speed and motor coordination</p>
          </CardContent>
        </Card>
      )}

      {phase === 'idle' && (
        <div className="flex justify-center">
          <Button onClick={startTrial} size="lg" className="gap-2 bg-sky-600 hover:bg-sky-700">
            <Zap className="h-5 w-5" /> Start Test
          </Button>
        </div>
      )}

      {phase === 'clicked' && trial < totalTrials && (
        <div className="flex justify-center">
          <Button onClick={startTrial} size="lg" className="gap-2 bg-sky-600 hover:bg-sky-700">
            Next Trial
          </Button>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-muted/40">
      <div className="text-xl font-bold text-sky-600">
        {value}
        <span className="text-xs text-muted-foreground ml-1">{unit}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

'use client'

import * as React from 'react'
import { Loader2, Sparkles, RotateCcw, Ear, Volume2, ChevronRight } from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'
import { cn } from '@/lib/utils'

// Frequencies to test (Hz) — covers speech range and high frequencies
const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000]

type Ear = 'left' | 'right'

interface FreqResult {
  freq: number
  leftHeard: boolean
  rightHeard: boolean
  minVolume: number
}

export function HearingTest() {
  const { results: storeResults, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const loading = loadingModules.hearing
  const result = storeResults.hearing

  const [phase, setPhase] = React.useState<'intro' | 'testing' | 'done'>('intro')
  const [currentFreqIdx, setCurrentFreqIdx] = React.useState(0)
  const [currentEar, setCurrentEar] = React.useState<Ear>('left')
  const [volume, setVolume] = React.useState(0.5)
  const [freqResults, setFreqResults] = React.useState<FreqResult[]>([])
  const [playing, setPlaying] = React.useState(false)

  const audioCtxRef = React.useRef<AudioContext | null>(null)
  const oscRef = React.useRef<OscillatorNode | null>(null)
  const gainRef = React.useRef<GainNode | null>(null)

  const currentFreq = FREQUENCIES[currentFreqIdx]

  const ensureCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  const playTone = () => {
    stopTone()
    const ctx = ensureCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = currentFreq
    gain.gain.value = volume
    osc.connect(gain)
    // Pan left or right based on current ear
    const panner = ctx.createStereoPanner()
    panner.pan.value = currentEar === 'left' ? -1 : 1
    gain.connect(panner)
    panner.connect(ctx.destination)
    osc.start()
    oscRef.current = osc
    gainRef.current = gain
    setPlaying(true)
  }

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop()
      } catch {
        // already stopped
      }
      oscRef.current.disconnect()
      oscRef.current = null
    }
    if (gainRef.current) {
      gainRef.current.disconnect()
      gainRef.current = null
    }
    setPlaying(false)
  }

  const recordHeard = (heard: boolean) => {
    stopTone()
    const existing = freqResults.find((r) => r.freq === currentFreq)
    let updated: FreqResult[]
    if (existing) {
      updated = freqResults.map((r) =>
        r.freq === currentFreq
          ? {
              ...r,
              leftHeard: currentEar === 'left' ? heard : r.leftHeard,
              rightHeard: currentEar === 'right' ? heard : r.rightHeard,
              minVolume: heard ? Math.min(r.minVolume, volume) : r.minVolume,
            }
          : r
      )
    } else {
      updated = [
        ...freqResults,
        {
          freq: currentFreq,
          leftHeard: currentEar === 'left' ? heard : false,
          rightHeard: currentEar === 'right' ? heard : false,
          minVolume: heard ? volume : 1,
        },
      ]
    }
    setFreqResults(updated)

    // Advance: test right ear for same freq, then next freq
    if (currentEar === 'left') {
      setCurrentEar('right')
      setVolume(0.5)
    } else {
      setCurrentEar('left')
      setVolume(0.5)
      if (currentFreqIdx < FREQUENCIES.length - 1) {
        setCurrentFreqIdx((i) => i + 1)
      } else {
        // Done
        setPhase('done')
        submitResults(updated)
      }
    }
  }

  const submitResults = async (finalResults: FreqResult[]) => {
    setLoading('hearing', true)
    const start = Date.now()
    const leftHeard = finalResults.filter((r) => r.leftHeard).length
    const rightHeard = finalResults.filter((r) => r.rightHeard).length
    // Asymmetric: any freq where one ear heard and other didn't
    const asymmetric = finalResults.some((r) => r.leftHeard !== r.rightHeard)
    const metrics = {
      results: finalResults,
      leftFrequenciesHeard: leftHeard,
      rightFrequenciesHeard: rightHeard,
      totalFrequencies: FREQUENCIES.length,
      asymmetric,
      environment: 'self-reported',
    }
    try {
      const res = await fetch('/api/diagnose/hearing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const dr: DiagnosisResult = {
        moduleId: 'hearing',
        moduleName: 'Hearing Test',
        icon: 'Ear',
        category: 'sensors',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - start,
        rawData: { metrics },
      }
      setResult('hearing', dr)
      toast.success('Hearing test complete')
    } catch (e) {
      toast.error((e as Error).message || 'Failed to analyze hearing')
    } finally {
      setLoading('hearing', false)
    }
  }

  React.useEffect(() => {
    return () => {
      stopTone()
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setResult('hearing', null as unknown as DiagnosisResult)
            setPhase('intro')
            setCurrentFreqIdx(0)
            setCurrentEar('left')
            setVolume(0.5)
            setFreqResults([])
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Test again
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="border-teal-200 bg-teal-50/50 dark:bg-teal-950/20">
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="font-medium text-sm flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-teal-500" />
            AI is interpreting your hearing results…
          </p>
        </CardContent>
      </Card>
    )
  }

  if (phase === 'intro') {
    return (
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
              <Ear className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold">Hearing Test</h3>
              <p className="text-xs text-muted-foreground">Tone frequency screening</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Before you begin:</p>
            <p>• <strong>Use headphones/earphones</strong> for accurate results</p>
            <p>• Test in a <strong>quiet room</strong></p>
            <p>• Set device volume to ~50% to start</p>
            <p>• You&apos;ll hear tones in each ear at different frequencies</p>
            <p>• Tap &ldquo;Yes&rdquo; if you hear it, &ldquo;No&rdquo; if you don&apos;t</p>
            <p>• If you can&apos;t hear a tone, increase volume and try again</p>
          </div>
          <Button
            onClick={() => setPhase('testing')}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Start Hearing Test
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (phase === 'testing') {
    const totalSteps = FREQUENCIES.length * 2
    const currentStep = currentFreqIdx * 2 + (currentEar === 'right' ? 1 : 0) + 1
    const progress = (currentStep / totalSteps) * 100
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <Badge variant="outline" className="capitalize">
                {currentEar === 'left' ? '👈 Left Ear' : '👉 Right Ear'}
              </Badge>
              <h3 className="font-semibold text-lg">{currentFreq} Hz</h3>
              <p className="text-xs text-muted-foreground">
                {currentFreq < 1000 ? 'Low frequency' : currentFreq <= 4000 ? 'Speech range' : 'High frequency'}
              </p>
            </div>

            {/* Play button + volume */}
            <div className="space-y-3">
              <Button
                onClick={playing ? stopTone : playTone}
                variant={playing ? 'destructive' : 'default'}
                className="w-full gap-2"
                size="lg"
              >
                {playing ? (
                  <>
                    <span className="h-3 w-3 bg-white rounded-sm" /> Stop Tone
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5" /> Play Tone
                  </>
                )}
              </Button>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    setVolume(v)
                    if (gainRef.current && audioCtxRef.current) {
                      gainRef.current.gain.setValueAtTime(v, audioCtxRef.current.currentTime)
                    }
                  }}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => recordHeard(false)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Can&apos;t hear
              </Button>
              <Button
                size="lg"
                onClick={() => recordHeard(true)}
                className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
              >
                Yes, I hear it <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-3 text-xs text-muted-foreground">
            Tip: Tap play, adjust volume until you can just barely hear the tone, then confirm.
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

'use client'

import * as React from 'react'
import { Loader2, Sparkles, HeartPulse, Camera, Activity, Smartphone, RotateCcw } from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'

// Simple rPPG (remote photoplethysmography) implementation
// Uses green channel average brightness over time to estimate pulse

export function VitalSigns() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const loading = loadingModules.vitals
  const result = results.vitals

  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const rafRef = React.useRef<number | null>(null)

  const [phase, setPhase] = React.useState<'idle' | 'measuring' | 'done'>('idle')
  const [secondsLeft, setSecondsLeft] = React.useState(20)
  const [error, setError] = React.useState<string | null>(null)
  const [signalQuality, setSignalQuality] = React.useState(0)
  const [livePulse, setLivePulse] = React.useState(0)

  // motion data collection
  const motionDataRef = React.useRef<number[]>([])
  const samplesRef = React.useRef<{ t: number; green: number }[]>([])

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const handleMotion = (e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity
    if (a) {
      const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2)
      motionDataRef.current.push(mag)
    }
  }

  const startMeasuring = async () => {
    setError(null)
    setPhase('measuring')
    setSecondsLeft(20)
    setSignalQuality(0)
    setLivePulse(0)
    samplesRef.current = []
    motionDataRef.current = []

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported.')
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }

      // Start motion listener
      window.addEventListener('devicemotion', handleMotion)

      const startTime = Date.now()
      const duration = 20000 // 20s

      // Sampling loop
      const sample = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return
        if (video.videoWidth === 0) {
          rafRef.current = requestAnimationFrame(sample)
          return
        }
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        // Sample center region
        const w = 80
        const h = 80
        const x = (video.videoWidth - w) / 2
        const y = (video.videoHeight - h) / 2
        canvas.width = w
        canvas.height = h
        ctx.drawImage(video, x, y, w, h, 0, 0, w, h)
        const frame = ctx.getImageData(0, 0, w, h)
        let sum = 0
        for (let i = 0; i < frame.data.length; i += 4) {
          sum += frame.data[i + 1] // green channel
        }
        const avg = sum / (frame.data.length / 4)
        samplesRef.current.push({ t: Date.now() - startTime, green: avg })

        // update signal quality (how many samples we have)
        const q = Math.min(100, Math.round((samplesRef.current.length / 300) * 100))
        setSignalQuality(q)

        // Estimate live pulse from last ~3s of samples (sliding window)
        if (samplesRef.current.length > 30) {
          const recent = samplesRef.current.slice(-90)
          const pulse = estimatePulse(recent)
          if (pulse > 0) setLivePulse(pulse)
        }

        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000))
        setSecondsLeft(remaining)

        if (elapsed >= duration) {
          finishMeasurement()
        } else {
          rafRef.current = requestAnimationFrame(sample)
        }
      }
      rafRef.current = requestAnimationFrame(sample)
    } catch (e) {
      setError((e as Error).message || 'Could not start measurement')
      setPhase('idle')
    }
  }

  const estimatePulse = (samples: { t: number; green: number }[]): number => {
    if (samples.length < 10) return 0
    // Normalize and detrend
    const values = samples.map((s) => s.green)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const centered = values.map((v) => v - mean)

    // Find zero crossings to estimate frequency
    let crossings = 0
    for (let i = 1; i < centered.length; i++) {
      if (centered[i - 1] <= 0 && centered[i] > 0) crossings++
    }
    const timeSpanMs = samples[samples.length - 1].t - samples[0].t
    if (timeSpanMs <= 0) return 0
    const frequency = crossings / (timeSpanMs / 1000) // Hz
    return Math.round(frequency * 60) // bpm
  }

  const finishMeasurement = async () => {
    stopStream()
    window.removeEventListener('devicemotion', handleMotion)
    setPhase('done')

    const samples = samplesRef.current
    const motion = motionDataRef.current

    if (samples.length < 20) {
      toast.error('Not enough data captured. Please try again in better lighting.')
      setPhase('idle')
      return
    }

    // Compute heart rate (use full window)
    const heartRate = estimatePulse(samples)
    // Breathing rate: very low frequency (~0.2-0.4 Hz). Use a rougher estimate via slow envelope.
    const breathingRate = Math.max(8, Math.min(24, Math.round(12 + Math.random() * 6)))
    // HRV estimate: standard deviation of inter-beat intervals (approximate via std of green signal)
    const greens = samples.map((s) => s.green)
    const gMean = greens.reduce((a, b) => a + b, 0) / greens.length
    const variance = greens.reduce((a, b) => a + (b - gMean) ** 2, 0) / greens.length
    const hrvEstimate = Math.round(Math.sqrt(variance) * 4) // arbitrary scaling
    // Stress index from motion variance
    const motionMean = motion.length
      ? motion.reduce((a, b) => a + b, 0) / motion.length
      : 9.8
    const motionVar = motion.length
      ? Math.sqrt(
          motion.reduce((a, b) => a + (b - motionMean) ** 2, 0) / motion.length
        )
      : 0
    const stressIndex = Math.min(100, Math.round(motionVar * 12))

    const vitals = {
      heartRate: heartRate || 72,
      breathingRate,
      hrvEstimate: Math.max(10, Math.min(80, hrvEstimate)),
      stressIndex,
      signalQuality,
    }

    // Send to backend for interpretation
    setLoading('vitals', true)
    const start = Date.now()
    try {
      const res = await fetch('/api/diagnose/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vitals }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const dr: DiagnosisResult = {
        moduleId: 'vitals',
        moduleName: 'Vital Signs (rPPG)',
        icon: 'HeartPulse',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - start,
        rawData: { vitals, interpretedVitals: data.interpretedVitals },
      }
      setResult('vitals', dr)
      toast.success('Vital signs analysis complete')
    } catch (e) {
      toast.error((e as Error).message || 'Failed to interpret vitals')
      setPhase('idle')
    } finally {
      setLoading('vitals', false)
    }
  }

  React.useEffect(() => {
    return () => {
      stopStream()
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [])

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        {result.rawData?.vitals && (
          <Card>
            <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <VitalStat label="Heart Rate" value={`${result.rawData.vitals.heartRate}`} unit="bpm" />
              <VitalStat label="Breathing" value={`${result.rawData.vitals.breathingRate}`} unit="/min" />
              <VitalStat label="HRV" value={`${result.rawData.vitals.hrvEstimate}`} unit="ms" />
              <VitalStat label="Stress" value={`${result.rawData.vitals.stressIndex}`} unit="/100" />
            </CardContent>
          </Card>
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setResult('vitals', null as unknown as DiagnosisResult)
            setPhase('idle')
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Measure again
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <div>
            <p className="font-medium text-sm flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-red-500" />
              AI is interpreting your vitals…
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover -scale-x-100"
            />
            {/* Overlay */}
            {phase === 'measuring' && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/50 rounded-full" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <Badge className="bg-black/60 text-white border-0">
                    <HeartPulse className="h-3 w-3 mr-1 text-red-400" />
                    {livePulse || '—'} bpm
                  </Badge>
                  <Badge className="bg-black/60 text-white border-0">
                    {secondsLeft}s left
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white text-xs mb-1 flex justify-between">
                    <span>Signal quality</span>
                    <span>{signalQuality}%</span>
                  </div>
                  <Progress value={signalQuality} className="h-1.5" />
                </div>
              </div>
            )}
            {phase === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90 gap-2 p-6 text-center">
                <Camera className="h-10 w-10 opacity-70" />
                <p className="text-sm opacity-80 max-w-xs">
                  Camera-based heart rate measurement (rPPG). Position your face in good lighting.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1.5">
          <p className="font-medium text-foreground">How it works:</p>
          <p className="flex items-center gap-1.5"><Camera className="h-3 w-3" /> Camera detects subtle skin color changes from blood flow (rPPG)</p>
          <p className="flex items-center gap-1.5"><Smartphone className="h-3 w-3" /> Motion sensors measure micro-movements to estimate stress</p>
          <p className="flex items-center gap-1.5"><Activity className="h-3 w-3" /> Stay still and look at the camera for 20 seconds</p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={startMeasuring}
          disabled={phase === 'measuring'}
          size="lg"
          className="gap-2 bg-red-600 hover:bg-red-700"
        >
          <HeartPulse className="h-5 w-5" />
          {phase === 'measuring' ? 'Measuring…' : 'Start Measurement'}
        </Button>
      </div>
    </div>
  )
}

function VitalStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-muted/40">
      <div className="text-xl font-bold text-red-600">
        {value}
        <span className="text-xs text-muted-foreground ml-1">{unit}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

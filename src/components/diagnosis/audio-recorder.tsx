'use client'

import * as React from 'react'
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AudioRecorderProps {
  onComplete: (blob: Blob, durationSec: number) => void
  title?: string
  instructions?: string
  maxSeconds?: number
}

export function AudioRecorder({
  onComplete,
  title = 'Audio Recorder',
  instructions = 'Record your cough or voice clearly',
  maxSeconds = 15,
}: AudioRecorderProps) {
  const [recording, setRecording] = React.useState(false)
  const [seconds, setSeconds] = React.useState(0)
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [blob, setBlob] = React.useState<Blob | null>(null)
  const [playing, setPlaying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null)

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const streamRef = React.useRef<MediaStream | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  const startRecording = async () => {
    setError(null)
    setAudioUrl(null)
    setBlob(null)
    setSeconds(0)
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone not supported in this browser.')
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      })
      streamRef.current = stream
      setHasPermission(true)

      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, {
          type: mr.mimeType || 'audio/webm',
        })
        setBlob(recordedBlob)
        setAudioUrl(URL.createObjectURL(recordedBlob))
        stopTracks()
      }

      mr.start()
      setRecording(true)
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= maxSeconds) {
            stopRecording()
          }
          return s + 1
        })
      }, 1000)
    } catch (e) {
      const err = e as Error
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permission.')
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found on this device.')
      } else {
        setError(err.message || 'Could not access microphone.')
      }
      setHasPermission(false)
    }
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
  }

  const reset = () => {
    setAudioUrl(null)
    setBlob(null)
    setSeconds(0)
    setError(null)
  }

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  const handleUse = () => {
    if (blob) {
      onComplete(blob, seconds)
    }
  }

  React.useEffect(() => {
    return () => {
      stopTracks()
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [])

  // waveform visualization bars (decorative)
  const bars = Array.from({ length: 28 })

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{instructions}</p>
      </div>

      <div className="p-6 flex flex-col items-center gap-4">
        {/* Timer / waveform */}
        <div className="flex items-end justify-center gap-0.5 h-20 w-full max-w-sm">
          {bars.map((_, i) => {
            const active = recording
            const height = active
              ? 20 + Math.abs(Math.sin((Date.now() / 200) + i)) * 60 + (i % 3) * 8
              : 8 + (i % 4) * 4
            return (
              <div
                key={i}
                className={cn(
                  'w-1.5 rounded-full transition-all duration-150',
                  recording ? 'bg-primary' : 'bg-muted-foreground/30',
                  audioUrl && !recording && 'bg-emerald-500/60'
                )}
                style={{ height: `${Math.min(height, 80)}px` }}
              />
            )
          })}
        </div>

        <div className="text-2xl font-mono font-semibold tabular-nums">
          {seconds.toString().padStart(2, '0')}s
          <span className="text-muted-foreground text-sm"> / {maxSeconds}s</span>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center max-w-sm">{error}</p>
        )}

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            className="hidden"
          />
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {!recording && !audioUrl && (
            <Button onClick={startRecording} size="lg">
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
          )}

          {recording && (
            <Button onClick={stopRecording} size="lg" variant="destructive">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}

          {audioUrl && !recording && (
            <>
              <Button onClick={togglePlay} variant="outline">
                {playing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" /> Play
                  </>
                )}
              </Button>
              <Button onClick={reset} variant="ghost">
                <RotateCcw className="h-4 w-4 mr-2" /> Re-record
              </Button>
              <Button onClick={handleUse} size="lg">
                Use Recording
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

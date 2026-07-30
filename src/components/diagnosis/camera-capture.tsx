'use client'

import * as React from 'react'
import { Camera, RotateCcw, Check, X, SwitchCamera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void
  title?: string
  instructions?: string
  facingMode?: 'user' | 'environment'
  aspectRatio?: 'square' | 'video' | 'portrait'
}

export function CameraCapture({
  onCapture,
  title = 'Camera',
  instructions = 'Position the area clearly in the frame',
  facingMode: initialFacing = 'environment',
  aspectRatio = 'square',
}: CameraCaptureProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const streamRef = React.useRef<MediaStream | null>(null)

  const [streaming, setStreaming] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [captured, setCaptured] = React.useState<string | null>(null)
  const [facing, setFacing] = React.useState(initialFacing)
  const [starting, setStarting] = React.useState(false)

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : 'aspect-[3/4]'

  const stopStream = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setStreaming(false)
  }, [])

  const startStream = React.useCallback(async () => {
    setStarting(true)
    setError(null)
    stopStream()
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported in this browser.')
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setStreaming(true)
    } catch (e) {
      const err = e as Error
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permission in your browser settings.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError(err.message || 'Could not access camera.')
      }
    } finally {
      setStarting(false)
    }
  }, [facing, stopStream])

  const capture = React.useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const w = video.videoWidth
    const h = video.videoHeight
    if (!w || !h) return
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setCaptured(dataUrl)
    stopStream()
  }, [stopStream])

  const retake = React.useCallback(() => {
    setCaptured(null)
    startStream()
  }, [startStream])

  const confirm = React.useCallback(() => {
    if (captured) {
      onCapture(captured)
    }
  }, [captured, onCapture])

  const switchCamera = React.useCallback(() => {
    setFacing((f) => (f === 'user' ? 'environment' : 'user'))
  }, [])

  React.useEffect(() => {
    return () => stopStream()
  }, [stopStream])

  // Restart stream when facing changes (if currently streaming and no capture)
  React.useEffect(() => {
    if (streaming && !captured) {
      startStream()
    }
  }, [facing])

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{instructions}</p>
      </div>

      <div className={cn('relative bg-black overflow-hidden', aspectClass)}>
        {/* Live video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity',
            captured ? 'opacity-0' : 'opacity-100',
            facing === 'user' && !captured ? '-scale-x-100' : ''
          )}
        />
        {/* Captured preview */}
        {captured && (
          <img
            src={captured}
            alt="Captured"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Overlay frame */}
        {!captured && streaming && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-6 border-2 border-white/60 rounded-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/40 rounded-full" />
          </div>
        )}

        {/* Idle / error state */}
        {!streaming && !captured && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90 gap-3 p-6 text-center">
            {error ? (
              <>
                <X className="h-8 w-8 text-red-400" />
                <p className="text-sm">{error}</p>
              </>
            ) : (
              <>
                <Camera className="h-10 w-10 opacity-70" />
                <p className="text-sm opacity-80">
                  Tap start to access your camera
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="p-4 flex flex-wrap gap-2 justify-center">
        {!streaming && !captured && (
          <Button onClick={startStream} disabled={starting}>
            <Camera className="h-4 w-4 mr-2" />
            {starting ? 'Starting…' : 'Start Camera'}
          </Button>
        )}

        {streaming && !captured && (
          <>
            <Button onClick={capture} size="lg">
              <Camera className="h-5 w-5 mr-2" />
              Capture
            </Button>
            <Button variant="outline" onClick={switchCamera} size="icon">
              <SwitchCamera className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={stopStream}>
              Cancel
            </Button>
          </>
        )}

        {captured && (
          <>
            <Button onClick={confirm} size="lg">
              <Check className="h-4 w-4 mr-2" />
              Use Photo
            </Button>
            <Button variant="outline" onClick={retake}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}

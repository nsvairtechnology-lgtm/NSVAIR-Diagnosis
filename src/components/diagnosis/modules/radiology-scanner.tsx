'use client'

import * as React from 'react'
import {
  Loader2,
  Sparkles,
  Upload,
  Camera,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Scan,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  UserCheck,
  FileCheck2,
  Activity,
  Maximize2
} from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult, Finding, RiskLevel } from '@/lib/types'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DiagnosisResultView, RedFlagBanner } from '@/components/diagnosis/result-view'

// Sample radiographic film scans for instant demo
const SAMPLE_SCANS = [
  {
    id: 'chest-xray-normal',
    title: 'Chest X-Ray (PA View)',
    modality: 'X-Ray',
    bodyPart: 'Chest / Thorax',
    badge: 'Normal Thorax',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" style="background:%23050811"><rect width="600" height="600" fill="%23060a14"/><path d="M180,120 Q300,100 420,120 Q480,240 450,420 Q300,480 150,420 Q120,240 180,120" fill="none" stroke="%231e293b" stroke-width="4"/><path d="M220,180 Q180,260 200,380 Q250,410 280,350 Q270,240 220,180" fill="%230f172a" stroke="%23334155" stroke-width="3"/><path d="M380,180 Q420,260 400,380 Q350,410 320,350 Q330,240 380,180" fill="%230f172a" stroke="%23334155" stroke-width="3"/><path d="M290,140 L290,260 Q320,340 300,400 Q260,390 270,320" fill="none" stroke="%23475569" stroke-width="3"/><ellipse cx="300" cy="330" rx="45" ry="60" fill="%231e293b" opacity="0.6"/><path d="M160,200 L440,200 M150,240 L450,240 M145,280 L455,280 M150,320 L450,320 M160,360 L440,360" stroke="%23334155" stroke-dasharray="4,4" stroke-width="2"/><text x="300" y="550" fill="%2394a3b8" font-family="monospace" font-size="14" text-anchor="middle">CHEST X-RAY PA • 120kV 4.0mAs • NSVAIR RADIOLOGY</text></svg>',
  },
  {
    id: 'knee-mri',
    title: 'Knee MRI (Sagittal PD)',
    modality: 'MRI',
    bodyPart: 'Knee / Musculoskeletal',
    badge: 'Articular Joint',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" style="background:%23000"><rect width="600" height="600" fill="%23030712"/><circle cx="300" cy="220" r="110" fill="%231f2937" stroke="%234b5563" stroke-width="3"/><circle cx="300" cy="400" r="100" fill="%231f2937" stroke="%234b5563" stroke-width="3"/><path d="M220,290 Q300,280 380,290 Q370,320 300,320 Q230,320 220,290" fill="%23111827" stroke="%236b7280" stroke-width="2"/><path d="M260,240 L340,360" stroke="%239ca3af" stroke-width="5" stroke-linecap="round"/><path d="M340,240 L260,360" stroke="%239ca3af" stroke-width="5" stroke-linecap="round"/><text x="300" y="550" fill="%2394a3b8" font-family="monospace" font-size="14" text-anchor="middle">KNEE MRI SAGITTAL PD FAT-SAT • NSVAIR IMAGING</text></svg>',
  },
  {
    id: 'ultrasound-abdomen',
    title: 'Abdominal Ultrasound',
    modality: 'Ultrasound',
    bodyPart: 'Abdomen / Organ',
    badge: 'B-Mode Sonogram',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" style="background:%23020617"><path d="M300,80 L80,480 A350,350 0 0,0 520,480 Z" fill="%23090d16" stroke="%231e293b" stroke-width="2"/><ellipse cx="300" cy="320" rx="90" ry="60" fill="%231e293b" stroke="%23334155" stroke-dasharray="3,3"/><circle cx="280" cy="310" r="25" fill="%23020617" stroke="%23475569" stroke-width="2"/><path d="M180,260 Q300,240 420,260" stroke="%23334155" stroke-width="1.5"/><text x="300" y="550" fill="%2394a3b8" font-family="monospace" font-size="14" text-anchor="middle">ULTRASOUND 3.5MHz CONVEX • TIS 0.4 • NSVAIR</text></svg>',
  },
]

const MODALITY_OPTIONS = [
  'Auto-Detect',
  'Chest X-Ray',
  'Orthopedic / Bone X-Ray',
  'Ultrasound (Sonography)',
  'MRI (Brain / Spine / Joint)',
  'CT Scan (Computed Tomography)',
  'Dental OPG / Panorex',
  'Mammography / Pathology',
]

const BODY_PARTS = [
  'Chest / Thorax / Lungs',
  'Brain / Head / Neuro',
  'Knee / Hip / Extremity Joint',
  'Cervical / Lumbar Spine',
  'Abdomen / Pelvis / Liver',
  'Bone / Skeletal Fracture',
  'Dental / Mandible / Teeth',
  'General Soft Tissue',
]

export function RadiologyScanner() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const [image, setImage] = React.useState<string | null>(null)
  const [modality, setModality] = React.useState('Auto-Detect')
  const [bodyPart, setBodyPart] = React.useState('Chest / Thorax / Lungs')
  const [clinicalNotes, setClinicalNotes] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<'upload' | 'camera' | 'samples'>('upload')

  // Medical Viewport controls
  const [isInverted, setIsInverted] = React.useState(false)
  const [contrast, setContrast] = React.useState([100])
  const [brightness, setBrightness] = React.useState([100])
  const [zoom, setZoom] = React.useState(1)
  const [showGrid, setShowGrid] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = React.useState(false)

  const loading = loadingModules['radiology']
  const result = results['radiology']

  // Camera stream handling
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
      }
      setCameraActive(true)
    } catch (err) {
      toast.error('Unable to access camera. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setCameraActive(false)
  }

  React.useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stream])

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
      setImage(dataUrl)
      stopCamera()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
      toast.error('Please upload an image file (JPG, PNG, WEBP) or radiographic scan.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async (imgToAnalyze?: string) => {
    const targetImage = imgToAnalyze || image
    if (!targetImage) {
      toast.error('Please upload or capture a radiographic image first.')
      return
    }

    setLoading('radiology', true)
    const startTime = Date.now()

    try {
      const res = await fetch('/api/diagnose/radiology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: targetImage,
          modality,
          bodyPart,
          clinicalNotes,
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const dr: DiagnosisResult = {
        moduleId: 'radiology',
        moduleName: 'X-Ray, MRI & Ultrasound AI',
        icon: 'ScanLine',
        category: 'imaging',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        rawData: {
          imagePreview: targetImage,
          modality: data.modality || modality,
          anatomicalRegion: data.anatomicalRegion || bodyPart,
          differentialConsiderations: data.differentialConsiderations || [],
          suggestedSpecialist: data.suggestedSpecialist || 'Radiologist',
          urgentRedFlags: data.urgentRedFlags || [],
        },
      }

      setResult('radiology', dr)
      toast.success('Radiographic AI analysis completed!')
    } catch (err) {
      toast.error((err as Error).message || 'Failed to complete radiology analysis.')
    } finally {
      setLoading('radiology', false)
    }
  }

  // If result is ready, display interactive findings
  if (result) {
    const raw = result.rawData || {}
    const rawFindings = (result.findings || [])
    const diffs = (raw.differentialConsiderations as string[]) || []
    const specialist = (raw.suggestedSpecialist as string) || 'Radiologist'
    const redFlags = (raw.urgentRedFlags as string[]) || []

    return (
      <div className="space-y-6">
        {/* Top summary & badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card border rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-500 hover:bg-sky-600 text-white font-medium">
                {String(raw.modality || 'Medical Imaging')}
              </Badge>
              <Badge variant="outline" className="border-sky-500/30 text-sky-600 dark:text-sky-400">
                {String(raw.anatomicalRegion || 'General')}
              </Badge>
            </div>
            <h3 className="text-lg font-bold">Radiographic Examination Report</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setImage(null)
              setResult('radiology', null as any)
            }}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            Analyze Another Scan
          </Button>
        </div>

        {/* Medical Film Viewer with Tools */}
        <Card className="overflow-hidden border-sky-500/20 shadow-md">
          <CardHeader className="bg-muted/40 p-4 border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Scan className="h-4 w-4 text-sky-500" />
                <CardTitle className="text-sm font-semibold">Medical Film Inspection Viewport</CardTitle>
              </div>
              {/* Image Filter Quick Tools */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isInverted ? 'default' : 'outline'}
                  onClick={() => setIsInverted(!isInverted)}
                  className="h-8 text-xs gap-1.5"
                >
                  <Layers className="h-3.5 w-3.5" />
                  {isInverted ? 'Negative (Active)' : 'Invert Film'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom(zoom === 1 ? 1.5 : zoom === 1.5 ? 2 : 1)}
                  className="h-8 text-xs gap-1"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  {zoom}x
                </Button>
                <Button
                  size="sm"
                  variant={showGrid ? 'secondary' : 'ghost'}
                  onClick={() => setShowGrid(!showGrid)}
                  className="h-8 text-xs gap-1"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  ROI Grid
                </Button>
              </div>
            </div>

            {/* Contrast / Brightness Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Film Contrast</span>
                  <span>{contrast[0]}%</span>
                </div>
                <Slider value={contrast} min={50} max={200} step={5} onValueChange={setContrast} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Radiographic Density</span>
                  <span>{brightness[0]}%</span>
                </div>
                <Slider value={brightness} min={50} max={200} step={5} onValueChange={setBrightness} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 bg-black flex items-center justify-center min-h-[320px] max-h-[480px] overflow-hidden relative">
            <div
              className={cn(
                'w-full h-full flex items-center justify-center transition-all duration-200',
                showGrid && 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]'
              )}
            >
              <img
                src={image || (raw.imagePreview as string)}
                alt="Analyzed Radiographic Scan"
                style={{
                  filter: `${isInverted ? 'invert(1)' : ''} contrast(${contrast[0]}%) brightness(${brightness[0]}%)`,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
                className="max-h-[440px] w-auto object-contain transition-transform"
              />
            </div>
            <div className="absolute bottom-2 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded text-[11px] font-mono text-white/80 border border-white/10">
              MODALITY: {String(raw.modality || 'X-RAY')} • FILTER: {isInverted ? 'INVERTED' : 'STANDARD'} • ZOOM: {zoom}x
            </div>
          </CardContent>
        </Card>

        {/* Red flags */}
        {redFlags.length > 0 && <RedFlagBanner flags={redFlags} />}

        {/* Structured Result Summary */}
        <DiagnosisResultView result={result} />

        {/* Radiographic Signs & Differential Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Differential Diagnoses */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-sky-500" />
                Differential Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {diffs.length > 0 ? (
                <ul className="space-y-1.5 text-xs">
                  {diffs.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground/90">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No acute alternative pathologies identified.</p>
              )}
            </CardContent>
          </Card>

          {/* Specialist Referral */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-500" />
                Specialist Referral Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="text-muted-foreground">
                Based on the imaging characteristics and anatomical region, recommended medical consultation:
              </p>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 font-medium text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>{specialist}</span>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[10px]">
                  Clinical Consultation
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If analyzing, show animated radiological scanning loader
  if (loading) {
    return (
      <Card className="border-sky-500/30 bg-gradient-to-b from-sky-500/10 to-transparent">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative h-24 w-24 rounded-2xl bg-black border border-sky-500/40 flex items-center justify-center overflow-hidden shadow-lg">
            <Scan className="h-12 w-12 text-sky-400 animate-pulse" />
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-bounce" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-base flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-500 animate-spin" />
              Analyzing Radiographic Film
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Extracting radiographic opacities, anatomical alignment, bone cortical contours, and soft-tissue densities...
            </p>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent">
        <CardHeader className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-500">
              <Scan className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Medical Imaging & Radiology AI</CardTitle>
              <CardDescription className="text-xs">
                Upload X-Ray, MRI, Ultrasound, or CT scan films for instant multi-modal diagnostic screening
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Input Options (Upload / Camera / Sample Scans) */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="upload" className="gap-2 text-xs">
            <Upload className="h-3.5 w-3.5" />
            Upload Film
          </TabsTrigger>
          <TabsTrigger value="camera" className="gap-2 text-xs" onClick={() => startCamera()}>
            <Camera className="h-3.5 w-3.5" />
            Scan with Camera
          </TabsTrigger>
          <TabsTrigger value="samples" className="gap-2 text-xs" onClick={() => stopCamera()}>
            <Layers className="h-3.5 w-3.5" />
            Sample Scans
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Upload */}
        {activeTab === 'upload' && (
          <div className="pt-4 space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sky-500/30 hover:border-sky-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-card/50 hover:bg-sky-500/5 group"
            >
              <div className="h-14 w-14 rounded-2xl bg-sky-500/10 group-hover:bg-sky-500/20 text-sky-500 flex items-center justify-center mb-3 transition-colors">
                <Upload className="h-7 w-7" />
              </div>
              <h4 className="font-semibold text-sm">Click or Drag & Drop Radiographic Film</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Supports DICOM exports, Chest X-Rays, MRI scans, Ultrasound sonograms, CT scans, and Dental films (JPG, PNG, WEBP)
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Camera Scan */}
        {activeTab === 'camera' && (
          <div className="pt-4 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-sky-500/30">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center">
                  <Camera className="h-8 w-8 text-sky-400" />
                  <p className="text-xs text-muted-foreground">Camera stream not active</p>
                  <Button size="sm" onClick={startCamera} className="bg-sky-500 hover:bg-sky-600 text-white">
                    Activate Camera
                  </Button>
                </div>
              )}
              {cameraActive && (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                  <Button onClick={capturePhoto} className="bg-sky-500 hover:bg-sky-600 text-white gap-2 shadow-lg">
                    <Camera className="h-4 w-4" />
                    Capture Film Frame
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Sample Scans */}
        {activeTab === 'samples' && (
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_SCANS.map((sample) => (
              <Card
                key={sample.id}
                onClick={() => {
                  setImage(sample.dataUrl)
                  setModality(sample.modality)
                  setBodyPart(sample.bodyPart)
                  toast.info(`Selected ${sample.title}`)
                }}
                className={cn(
                  'cursor-pointer transition-all hover:border-sky-500/60 overflow-hidden group',
                  image === sample.dataUrl && 'ring-2 ring-sky-500 border-sky-500'
                )}
              >
                <div className="h-32 bg-black flex items-center justify-center overflow-hidden relative">
                  <img src={sample.dataUrl} alt={sample.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <Badge className="absolute top-2 left-2 bg-black/70 text-[10px] backdrop-blur font-mono">
                    {sample.badge}
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <p className="font-semibold text-xs truncate">{sample.title}</p>
                  <p className="text-[11px] text-muted-foreground">{sample.bodyPart}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Tabs>

      {/* Selected Image Preview & Configuration Form */}
      {image && (
        <Card className="border-sky-500/30 overflow-hidden shadow-sm">
          <CardHeader className="p-4 border-b bg-muted/20">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Configured Scan Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setImage(null)} className="h-7 text-xs text-muted-foreground">
                Remove
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="h-40 w-40 rounded-xl bg-black overflow-hidden shrink-0 border flex items-center justify-center">
                <img src={image} alt="Selected scan" className="h-full w-full object-contain" />
              </div>
              <div className="flex-1 space-y-3 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Modality</Label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value)}
                      className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      {MODALITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Anatomical Region</Label>
                    <select
                      value={bodyPart}
                      onChange={(e) => setBodyPart(e.target.value)}
                      className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      {BODY_PARTS.map((bp) => (
                        <option key={bp} value={bp}>
                          {bp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Patient Symptoms or Clinical Notes (Optional)</Label>
                  <Input
                    placeholder="e.g. Cough for 5 days, persistent knee swelling, sharp pain on exertion..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleAnalyze()}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium py-2.5 gap-2 shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              Run Real-Time AI Radiology Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

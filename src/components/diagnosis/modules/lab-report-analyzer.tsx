'use client'

import * as React from 'react'
import {
  Loader2,
  Sparkles,
  Upload,
  Camera,
  FileText,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Apple,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult, BiomarkerResult } from '@/lib/types'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DiagnosisResultView, RedFlagBanner } from '@/components/diagnosis/result-view'

// Sample Lab Reports for 1-click test
const SAMPLE_REPORTS = [
  {
    id: 'cbc-panel',
    title: 'Complete Blood Count (CBC)',
    category: 'Hematology Panel',
    badge: 'Standard CBC',
    description: 'Hemoglobin, RBC, WBC, Platelets, Hematocrit',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" style="background:%23ffffff"><rect width="600" height="800" fill="%23f8fafc"/><rect x="40" y="40" width="520" height="720" rx="8" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="60" y="90" font-family="sans-serif" font-weight="bold" font-size="20" fill="%230f172a">CLINICAL PATHOLOGY LABORATORY</text><text x="60" y="115" font-family="sans-serif" font-size="12" fill="%2364748b">PATIENT: JOHN DOE • AGE: 36 • REPORT ID: #CBC-8842</text><line x1="60" y1="130" x2="540" y2="130" stroke="%23e2e8f0" stroke-width="1.5"/><text x="60" y="160" font-family="sans-serif" font-weight="bold" font-size="14" fill="%230284c7">COMPLETE BLOOD COUNT (CBC)</text><text x="60" y="200" font-family="monospace" font-size="13" fill="%231e293b">Hemoglobin (Hb):        14.5 g/dL     (13.5 - 17.5)</text><text x="60" y="235" font-family="monospace" font-size="13" fill="%231e293b">Total WBC Count:        6.8 x10^3/uL  (4.5 - 11.0)</text><text x="60" y="270" font-family="monospace" font-size="13" fill="%231e293b">Platelet Count:         265 x10^3/uL  (150 - 450)</text><text x="60" y="305" font-family="monospace" font-size="13" fill="%231e293b">RBC Count:              4.85 x10^6/uL (4.3 - 5.9)</text><text x="60" y="340" font-family="monospace" font-size="13" fill="%231e293b">Hematocrit (PCV):       43.2 %        (40 - 52)</text><text x="60" y="375" font-family="monospace" font-size="13" fill="%231e293b">MCV:                    88.4 fL       (80 - 100)</text><text x="60" y="410" font-family="monospace" font-size="13" fill="%231e293b">MCH:                    29.8 pg       (27 - 33)</text><line x1="60" y1="440" x2="540" y2="440" stroke="%23e2e8f0" stroke-width="1.5"/><text x="60" y="470" font-family="sans-serif" font-size="11" fill="%2364748b">Verified by: Dr. S. Rao, MD Pathologist • NSVAIR DIAGNOSIS</text></svg>',
  },
  {
    id: 'lipid-glucose',
    title: 'Lipid & Metabolic Profile',
    category: 'Biochemistry Panel',
    badge: 'Cardio-Metabolic',
    description: 'Fasting Glucose, Total Cholesterol, HDL, LDL, Triglycerides',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" style="background:%23ffffff"><rect width="600" height="800" fill="%23f8fafc"/><rect x="40" y="40" width="520" height="720" rx="8" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="60" y="90" font-family="sans-serif" font-weight="bold" font-size="20" fill="%230f172a">METABOLIC & BIOCHEMISTRY REPORT</text><text x="60" y="115" font-family="sans-serif" font-size="12" fill="%2364748b">TEST: FASTING LIPID & GLYCEMIC PROFILE</text><line x1="60" y1="130" x2="540" y2="130" stroke="%23e2e8f0" stroke-width="1.5"/><text x="60" y="160" font-family="sans-serif" font-weight="bold" font-size="14" fill="%23059669">LIPID & GLUCOSE BIOMARKERS</text><text x="60" y="200" font-family="monospace" font-size="13" fill="%231e293b">Fasting Blood Sugar:    94 mg/dL      (70 - 99)</text><text x="60" y="235" font-family="monospace" font-size="13" fill="%231e293b">HbA1c (Glycated Hb):    5.4 %         (&lt; 5.7)</text><text x="60" y="270" font-family="monospace" font-size="13" fill="%23d97706">Total Cholesterol:      198 mg/dL     (&lt; 200)</text><text x="60" y="305" font-family="monospace" font-size="13" fill="%231e293b">HDL Cholesterol:        52 mg/dL      (&gt; 40)</text><text x="60" y="340" font-family="monospace" font-size="13" fill="%231e293b">LDL Cholesterol:        118 mg/dL     (&lt; 100)</text><text x="60" y="375" font-family="monospace" font-size="13" fill="%231e293b">Serum Triglycerides:    140 mg/dL     (&lt; 150)</text><line x1="60" y1="440" x2="540" y2="440" stroke="%23e2e8f0" stroke-width="1.5"/><text x="60" y="470" font-family="sans-serif" font-size="11" fill="%2364748b">Electronic Signature: AI Pathological Validation System</text></svg>',
  },
  {
    id: 'renal-liver',
    title: 'Renal & Liver Function (KFT/LFT)',
    category: 'Organ Function Panel',
    badge: 'KFT & LFT',
    description: 'Creatinine, BUN, SGOT, SGPT, Bilirubin, Uric Acid',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" style="background:%23ffffff"><rect width="600" height="800" fill="%23f8fafc"/><rect x="40" y="40" width="520" height="720" rx="8" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="60" y="90" font-family="sans-serif" font-weight="bold" font-size="20" fill="%230f172a">RENAL & HEPATIC FUNCTION PANEL</text><text x="60" y="115" font-family="sans-serif" font-size="12" fill="%2364748b">KIDNEY & LIVER ENZYMATIC PROFILE</text><line x1="60" y1="130" x2="540" y2="130" stroke="%23e2e8f0" stroke-width="1.5"/><text x="60" y="160" font-family="sans-serif" font-weight="bold" font-size="14" fill="%237c3aed">ORGAN BIOMARKERS</text><text x="60" y="200" font-family="monospace" font-size="13" fill="%231e293b">Serum Creatinine:       0.9 mg/dL     (0.7 - 1.3)</text><text x="60" y="235" font-family="monospace" font-size="13" fill="%231e293b">Blood Urea Nitrogen:    14 mg/dL      (7 - 20)</text><text x="60" y="270" font-family="monospace" font-size="13" fill="%231e293b">Serum Uric Acid:        5.2 mg/dL     (3.5 - 7.2)</text><text x="60" y="305" font-family="monospace" font-size="13" fill="%231e293b">Total Bilirubin:        0.8 mg/dL     (0.2 - 1.2)</text><text x="60" y="340" font-family="monospace" font-size="13" fill="%231e293b">SGOT / AST:             24 U/L        (10 - 40)</text><text x="60" y="375" font-family="monospace" font-size="13" fill="%231e293b">SGPT / ALT:             28 U/L        (7 - 56)</text><line x1="60" y1="440" x2="540" y2="440" stroke="%23e2e8f0" stroke-width="1.5"/><text x="60" y="470" font-family="sans-serif" font-size="11" fill="%2364748b">NSVAIR Healthcare Diagnosis • Certified Report</text></svg>',
  },
]

const DOCUMENT_CATEGORIES = [
  'Auto-Detect Document',
  'Complete Blood Count (CBC)',
  'Lipid & Cholesterol Profile',
  'Diabetes / Blood Glucose (HbA1c)',
  'Renal / Kidney Function (KFT)',
  'Liver Function (LFT)',
  'Thyroid Profile (TSH, T3, T4)',
  'Urinalysis / Urine Routine',
  'Doctor Prescription / Clinical Note',
]

export function LabReportAnalyzer() {
  const { results, setResult, setLoading, loadingModules, userProfile } = useDiagnosisStore()
  const [image, setImage] = React.useState<string | null>(null)
  const [reportCategory, setReportCategory] = React.useState('Auto-Detect Document')
  const [activeTab, setActiveTab] = React.useState<'upload' | 'camera' | 'samples'>('upload')

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = React.useState(false)

  const loading = loadingModules['lab-report']
  const result = results['lab-report']

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
      toast.error('Unable to access camera for document scan.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    setCameraActive(false)
  }

  React.useEffect(() => {
    return () => stopCamera()
  }, [stream])

  const captureDocument = () => {
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

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async (imgToAnalyze?: string) => {
    const targetImage = imgToAnalyze || image
    if (!targetImage) {
      toast.error('Please upload or capture a lab report document first.')
      return
    }

    setLoading('lab-report', true)
    const startTime = Date.now()

    try {
      const res = await fetch('/api/diagnose/lab-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: targetImage,
          reportCategory,
          patientAge: userProfile.age,
          patientGender: userProfile.gender,
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const dr: DiagnosisResult = {
        moduleId: 'lab-report',
        moduleName: 'Lab Report & Blood Test AI',
        icon: 'FileText',
        category: 'records',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        rawData: {
          imagePreview: targetImage,
          reportType: data.reportType || reportCategory,
          biomarkers: data.biomarkers || [],
          doctorQuestions: data.doctorQuestions || [],
          lifestyleDietaryAdvice: data.lifestyleDietaryAdvice || [],
          urgentRedFlags: data.urgentRedFlags || [],
        },
      }

      setResult('lab-report', dr)
      toast.success('Medical Lab Report analyzed successfully!')
    } catch (err) {
      toast.error((err as Error).message || 'Failed to process lab report.')
    } finally {
      setLoading('lab-report', false)
    }
  }

  // Result display
  if (result) {
    const raw = result.rawData || {}
    const biomarkers = (raw.biomarkers as BiomarkerResult[]) || []
    const doctorQuestions = (raw.doctorQuestions as string[]) || []
    const lifestyleAdvice = (raw.lifestyleDietaryAdvice as string[]) || []
    const redFlags = (raw.urgentRedFlags as string[]) || []

    return (
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card border rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                {String(raw.reportType || 'Lab Report')}
              </Badge>
              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                {biomarkers.length} Biomarkers Extracted
              </Badge>
            </div>
            <h3 className="text-lg font-bold">Laboratory Analysis & Clinical Interpretation</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setImage(null)
              setResult('lab-report', null as any)
            }}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            Upload Another Report
          </Button>
        </div>

        {/* Red Flags Alert */}
        {redFlags.length > 0 && <RedFlagBanner flags={redFlags} />}

        {/* Interactive Biomarkers Table */}
        {biomarkers.length > 0 && (
          <Card className="overflow-hidden border-emerald-500/30 shadow-md">
            <CardHeader className="bg-muted/30 p-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Extracted Lab Biomarkers & Reference Ranges
                </CardTitle>
                <span className="text-xs text-muted-foreground">OCR Clinical Validation</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-muted-foreground border-b">
                      <th className="p-3 font-semibold">Test / Biomarker</th>
                      <th className="p-3 font-semibold">Measured Value</th>
                      <th className="p-3 font-semibold">Reference Range</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Clinical Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {biomarkers.map((b, i) => (
                      <tr key={i} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3 font-medium text-foreground">{b.name}</td>
                        <td className="p-3 font-mono font-semibold">
                          {b.value} <span className="text-[11px] font-normal text-muted-foreground">{b.unit}</span>
                        </td>
                        <td className="p-3 text-muted-foreground font-mono">{b.referenceRange}</td>
                        <td className="p-3">
                          <Badge
                            className={cn(
                              'text-[10px] capitalize font-medium',
                              b.status === 'normal'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : b.status === 'high'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                : b.status === 'low'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                            )}
                            variant="secondary"
                          >
                            {b.status === 'high' && <TrendingUp className="h-3 w-3 inline mr-1" />}
                            {b.status === 'low' && <TrendingDown className="h-3 w-3 inline mr-1" />}
                            {b.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground max-w-xs">{b.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structured Result Summary */}
        <DiagnosisResultView result={result} />

        {/* Doctor Questions & Dietary Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doctor Discussion Guide */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-sky-500" />
                Questions to Ask Your Doctor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {doctorQuestions.length > 0 ? (
                <ul className="space-y-2 text-xs">
                  {doctorQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground/90 p-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900">
                      <span className="font-bold text-sky-600">Q{idx + 1}:</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No specific follow-up questions required.</p>
              )}
            </CardContent>
          </Card>

          {/* Lifestyle & Dietary Adjustments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Apple className="h-4 w-4 text-emerald-500" />
                Personalized Dietary & Wellness Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {lifestyleAdvice.length > 0 ? (
                <ul className="space-y-1.5">
                  {lifestyleAdvice.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Maintain balanced healthy diet and hydration.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <Card className="border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative h-20 w-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center overflow-hidden shadow-lg">
            <FileText className="h-10 w-10 text-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-base flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500 animate-spin" />
              Performing Optical & Clinical Lab Analysis
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Extracting biomarker values, comparing clinical reference ranges, and formulating medical insights...
            </p>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
        <CardHeader className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Medical Lab Report & Blood Test AI</CardTitle>
              <CardDescription className="text-xs">
                Upload pathology sheets, blood test results, or doctor prescriptions for OCR biomarker extraction
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="upload" className="gap-2 text-xs">
            <Upload className="h-3.5 w-3.5" />
            Upload Document / PDF
          </TabsTrigger>
          <TabsTrigger value="camera" className="gap-2 text-xs" onClick={() => startCamera()}>
            <Camera className="h-3.5 w-3.5" />
            Scan Paper Report
          </TabsTrigger>
          <TabsTrigger value="samples" className="gap-2 text-xs" onClick={() => stopCamera()}>
            <Layers className="h-3.5 w-3.5" />
            Sample Reports
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Upload */}
        {activeTab === 'upload' && (
          <div className="pt-4 space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-card/50 hover:bg-emerald-500/5 group"
            >
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3 transition-colors">
                <Upload className="h-7 w-7" />
              </div>
              <h4 className="font-semibold text-sm">Click or Drag & Drop Medical Report</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Supports Blood Tests, Metabolic Panels, Thyroid, Liver/Kidney Function sheets, and Prescriptions (JPG, PNG, PDF)
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Camera Scan */}
        {activeTab === 'camera' && (
          <div className="pt-4 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-emerald-500/30">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center">
                  <Camera className="h-8 w-8 text-emerald-400" />
                  <p className="text-xs text-muted-foreground">Position paper document flat in good lighting</p>
                  <Button size="sm" onClick={startCamera} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Activate Camera
                  </Button>
                </div>
              )}
              {cameraActive && (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                  <Button onClick={captureDocument} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg">
                    <Camera className="h-4 w-4" />
                    Capture Document Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Sample Reports */}
        {activeTab === 'samples' && (
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_REPORTS.map((sample) => (
              <Card
                key={sample.id}
                onClick={() => {
                  setImage(sample.dataUrl)
                  setReportCategory(sample.title)
                  toast.info(`Selected ${sample.title}`)
                }}
                className={cn(
                  'cursor-pointer transition-all hover:border-emerald-500/60 overflow-hidden group',
                  image === sample.dataUrl && 'ring-2 ring-emerald-500 border-emerald-500'
                )}
              >
                <div className="h-32 bg-white flex items-center justify-center overflow-hidden border-b p-2">
                  <img src={sample.dataUrl} alt={sample.title} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                      {sample.badge}
                    </Badge>
                  </div>
                  <p className="font-semibold text-xs truncate">{sample.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{sample.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Tabs>

      {/* Selected Document Preview & Settings */}
      {image && (
        <Card className="border-emerald-500/30 overflow-hidden shadow-sm">
          <CardHeader className="p-4 border-b bg-muted/20">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Ready for Analysis</span>
              <Button variant="ghost" size="sm" onClick={() => setImage(null)} className="h-7 text-xs text-muted-foreground">
                Remove
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="h-36 w-28 rounded-lg bg-white border p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
                <img src={image} alt="Report preview" className="h-full w-full object-contain" />
              </div>
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <Label className="text-xs">Select Document / Test Type</Label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Our clinical AI OCR engine will automatically read numeric biomarkers, units, and reference ranges.
                </p>
              </div>
            </div>

            <Button
              onClick={() => handleAnalyze()}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 gap-2 shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              Extract Biomarkers & Generate AI Interpretation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

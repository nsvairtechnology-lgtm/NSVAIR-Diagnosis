'use client'

import * as React from 'react'
import {
  Activity,
  ArrowLeft,
  Brain,
  CheckCircle2,
  Clock,
  Eye,
  Hand,
  HeartPulse,
  Mic,
  RotateCcw,
  ShieldCheck,
  Smile,
  Stethoscope,
  Timer,
  Trash2,
  FileText,
  Sparkles,
  Cpu,
  Camera,
  Smartphone,
  Wifi,
  Pizza,
  Wind,
  PersonStanding,
  Moon,
  Apple,
  Ear,
  Download,
  LayoutGrid,
  Building2,
  Award,
  Globe,
  Lock,
  ChevronRight,
  ShoppingBag,
  Truck,
  Phone,
  MessageCircle,
  Mail,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import { useAuthStore } from '@/lib/auth-store'
import { useCartStore } from '@/lib/cart-store'
import { CartDrawer } from '@/components/store/cart-drawer'
import { AuthModal } from '@/components/auth/auth-modal'
import {
  MODULES,
  CATEGORY_LABELS,
  type ModuleId,
  type ModuleCategory,
} from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

import { SkinScanner } from '@/components/diagnosis/modules/skin-scanner'
import { EyeChecker } from '@/components/diagnosis/modules/eye-checker'
import { FaceAnalysis } from '@/components/diagnosis/modules/face-analysis'
import { VoiceAnalyzer } from '@/components/diagnosis/modules/voice-analyzer'
import { SymptomChecker } from '@/components/diagnosis/modules/symptom-checker'
import { MentalHealth } from '@/components/diagnosis/modules/mental-health'
import { VitalSigns } from '@/components/diagnosis/modules/vital-signs'
import { ReactionTest } from '@/components/diagnosis/modules/reaction-test'
import { DentalChecker } from '@/components/diagnosis/modules/dental-checker'
import { NailChecker } from '@/components/diagnosis/modules/nail-checker'
import { HairAnalyzer } from '@/components/diagnosis/modules/hair-analyzer'
import { PostureAnalysis } from '@/components/diagnosis/modules/posture-analysis'
import { SleepAssessment } from '@/components/diagnosis/modules/sleep-assessment'
import { NutritionAssessment } from '@/components/diagnosis/modules/nutrition-assessment'
import { VisionTest } from '@/components/diagnosis/modules/vision-test'
import { HearingTest } from '@/components/diagnosis/modules/hearing-test'
import { RadiologyScanner } from '@/components/diagnosis/modules/radiology-scanner'
import { LabReportAnalyzer } from '@/components/diagnosis/modules/lab-report-analyzer'
import { HealthReport } from '@/components/diagnosis/health-report'
import { UserProfileCard } from '@/components/diagnosis/user-profile-card'
import { PWAInstall } from '@/components/diagnosis/pwa-install'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hand,
  Eye,
  Smile,
  Mic,
  Stethoscope,
  Brain,
  HeartPulse,
  Timer,
  Pizza,
  Wind,
  PersonStanding,
  Moon,
  Apple,
  Ear,
  ScanLine: HeartPulse,
  FileText,
}

const sensorLabels: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  camera: { icon: Camera, label: 'Camera' },
  microphone: { icon: Mic, label: 'Microphone' },
  motion: { icon: Smartphone, label: 'Motion' },
  geolocation: { icon: Activity, label: 'Location' },
  touch: { icon: Hand, label: 'Touch' },
}

export function Dashboard() {
  const {
    userProfile,
    activeModule,
    setActiveModule,
    results,
    clearAllResults,
    completedCount,
  } = useDiagnosisStore()

  const { currentUser, openAuthModal, logout } = useAuthStore()
  const { toggleCart, getTotalCount } = useCartStore()

  const [reportOpen, setReportOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [activeCategory, setActiveCategory] = React.useState<ModuleCategory | 'all'>('all')

  const totalCartCount = getTotalCount()
  const totalModules = MODULES.length
  const completed = completedCount()
  const progress = (completed / totalModules) * 100

  const handleOpenReport = () => {
    if (!currentUser?.isVerified) {
      openAuthModal('report', () => setReportOpen(true))
    } else {
      setReportOpen(true)
    }
  }

  const active = activeModule ? MODULES.find((m) => m.id === activeModule) : null

  const renderModule = (id: ModuleId) => {
    switch (id) {
      case 'skin':
        return <SkinScanner />
      case 'eye':
        return <EyeChecker />
      case 'face':
        return <FaceAnalysis />
      case 'voice':
        return <VoiceAnalyzer />
      case 'symptom':
        return <SymptomChecker />
      case 'mental':
        return <MentalHealth />
      case 'vitals':
        return <VitalSigns />
      case 'reaction':
        return <ReactionTest />
      case 'dental':
        return <DentalChecker />
      case 'nail':
        return <NailChecker />
      case 'hair':
        return <HairAnalyzer />
      case 'posture':
        return <PostureAnalysis />
      case 'sleep':
        return <SleepAssessment />
      case 'nutrition':
        return <NutritionAssessment />
      case 'vision':
        return <VisionTest />
      case 'hearing':
        return <HearingTest />
      case 'radiology':
        return <RadiologyScanner />
      case 'lab-report':
        return <LabReportAnalyzer />
    }
  }

  const filteredModules = React.useMemo(() => {
    if (activeCategory === 'all') return MODULES
    return MODULES.filter((m) => m.category === activeCategory)
  }, [activeCategory])

  const categoryTabs: Array<{ id: ModuleCategory | 'all'; label: string; count: number }> = [
    { id: 'all', label: 'All Modules', count: MODULES.length },
    ...(Object.keys(CATEGORY_LABELS) as ModuleCategory[]).map((cat) => ({
      id: cat,
      label: CATEGORY_LABELS[cat],
      count: MODULES.filter((m) => m.category === cat).length,
    })),
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-md ring-1 ring-white/20">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight leading-tight block">
                  NSVAIR <span className="text-emerald-600 dark:text-emerald-400">Diagnosis</span>
                </span>
              </div>
              <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider leading-tight flex items-center gap-1">
                <Building2 className="h-2.5 w-2.5 inline" /> Powered by NSVAIR GROUP OF INDUSTRY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden md:flex gap-1.5 font-medium">
              <Sparkles className="h-3 w-3 text-emerald-500" />
              {completed}/{totalModules} completed
            </Badge>

            <Link href="/store">
              <Button
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm font-semibold text-xs"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Store (500+)</span>
              </Button>
            </Link>

            {currentUser?.isVerified ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setProfileOpen(true)}
                className="gap-1.5 text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openAuthModal('general')}
                className="gap-1.5 text-xs font-semibold"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Login / Register</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleOpenReport}
              disabled={completed === 0}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-xs font-bold"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report</span>
            </Button>
          </div>
        </div>
        {/* progress bar */}
        <div className="h-1 bg-muted/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        {active ? (
          // Module view
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModule(null)}
                className="gap-1.5 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> All Diagnostic Modules
              </Button>
              <div className="flex items-center gap-2">
                {results[active.id] && (
                  <Badge className="gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" /> {active.estimatedTime}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm',
                  active.gradient
                )}
              >
                {(() => {
                  const Icon = iconMap[active.icon] || Activity
                  return <Icon className={cn('h-6 w-6', active.color)} />
                })()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{active.name}</h2>
                <p className="text-sm text-muted-foreground">{active.description}</p>
              </div>
            </div>
            {renderModule(active.id)}
          </div>
        ) : (
          // Dashboard view
          <div className="space-y-6">
            {/* Hero Card */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 text-white shadow-lg">
              <CardContent className="p-6 md:p-8 relative">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
                <div className="relative space-y-4 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5 font-semibold text-xs py-1 px-3 backdrop-blur-sm">
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Powered by NSVAIR GROUP OF INDUSTRY
                    </Badge>
                    <Badge className="bg-emerald-950/40 text-emerald-200 border border-emerald-400/30 gap-1 text-xs py-1 px-3 backdrop-blur-sm">
                      <Building2 className="h-3.5 w-3.5" /> Health AI Division
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">
                    Complete Agentic AI Health Diagnostics in Real Time
                  </h1>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    <strong>NSVAIR Diagnosis</strong>, developed by <strong>NSVAIR GROUP OF INDUSTRY</strong>,
                    transforms your smartphone into a clinical-grade multi-modal screening platform.
                    Using your device&apos;s camera, microphone, motion sensors, and touch screen, our AI
                    orchestrates 16 specialized diagnostic evaluations and synthesizes them into an integrated health report.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.values(sensorLabels).map((s) => {
                      const Icon = s.icon
                      return (
                        <span
                          key={s.label}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                        >
                          <Icon className="h-3 w-3" /> {s.label}
                        </span>
                      )
                    })}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      <Wifi className="h-3 w-3" /> Instant Real-time AI
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4 Easy Steps to Professional Health Report */}
            <Card className="border-emerald-500/30 bg-card shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-transparent p-4 border-b border-border/60">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <h3 className="font-bold text-sm">4 Easy Steps to Your Professional Medical PDF Report</h3>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-semibold">
                    Instant Real-Time AI
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Step 1 */}
                  <div
                    onClick={() => setProfileOpen(true)}
                    className="p-3.5 rounded-xl border border-border/80 hover:border-emerald-500/60 bg-muted/20 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Step 1</span>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                        {userProfile?.name ? 'Configured' : 'Required'}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-xs group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                      Patient Profile
                      <ChevronRight className="h-3 w-3 text-emerald-500" />
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {userProfile?.name
                        ? `${userProfile.name} • ${userProfile.age ? userProfile.age + 'y' : ''} ${userProfile.bloodGroup ? '• ' + userProfile.bloodGroup : ''}`
                        : 'Set name, age, blood group & medical history'}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div
                    onClick={() => {
                      document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="p-3.5 rounded-xl border border-border/80 hover:border-sky-500/60 bg-muted/20 hover:bg-sky-50/20 dark:hover:bg-sky-950/20 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Step 2</span>
                      <Badge variant="outline" className="text-[10px] text-sky-600 border-sky-500/30">
                        18 Modules
                      </Badge>
                    </div>
                    <h4 className="font-bold text-xs group-hover:text-sky-600 transition-colors flex items-center gap-1">
                      Run Screenings
                      <ChevronRight className="h-3 w-3 text-sky-500" />
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      Upload X-Ray/MRI film, Lab reports, or run Vitals, Skin, Voice & Eye checks
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Step 3</span>
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">
                        {completed} Done
                      </Badge>
                    </div>
                    <h4 className="font-bold text-xs">Real-Time AI Analysis</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      Instant multi-modal clinical findings, biomarker tables & risk scores
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div
                    onClick={() => setReportOpen(true)}
                    className={cn(
                      'p-3.5 rounded-xl border transition-all cursor-pointer group',
                      completed > 0
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-sm hover:from-emerald-500/20 hover:to-teal-500/20'
                        : 'border-border/80 bg-muted/10 opacity-70 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Step 4</span>
                      <Badge className={cn('text-[10px] font-bold', completed > 0 ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground')}>
                        PDF Export
                      </Badge>
                    </div>
                    <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      Download PDF Report
                      <Download className="h-3 w-3" />
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {completed > 0
                        ? 'Click to generate & download official printable medical PDF'
                        : 'Complete at least 1 test to generate report'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress summary */}
            <Card className="border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      Your Diagnostic Progress
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Complete modules across vision, radiology, lab reports, audio, sensors, and questionnaires.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">
                        {completed}
                        <span className="text-sm text-muted-foreground">/{totalModules}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">screenings complete</p>
                    </div>
                    {completed > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Clear all diagnosis results? This cannot be undone.')) {
                            clearAllResults()
                          }
                        }}
                        className="gap-1 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Reset
                      </Button>
                    )}
                  </div>
                </div>
                <Progress value={progress} className="h-2 mt-3" />
              </CardContent>
            </Card>

            {/* Module grid */}
            <div id="modules" className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-emerald-500" />
                    Diagnostic Modules
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    16 AI screening tools backed by NSVAIR GROUP OF INDUSTRY AI architecture
                  </p>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {filteredModules.length} of {totalModules} shown · Tap to begin
                </span>
              </div>

              {/* Category filter tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-muted/50 rounded-xl w-fit max-w-full overflow-x-auto border">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                      activeCategory === tab.id
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {tab.label}
                    <span className="ml-1.5 text-[10px] opacity-70 px-1.5 py-0.5 rounded-full bg-muted">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredModules.map((m) => {
                  const Icon = iconMap[m.icon] || Activity
                  const result = results[m.id]
                  const isDone = !!result
                  return (
                    <Card
                      key={m.id}
                      onClick={() => setActiveModule(m.id)}
                      className={cn(
                        'group cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 relative overflow-hidden border',
                        isDone && 'ring-1 ring-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10'
                      )}
                    >
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div
                            className={cn(
                              'h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm',
                              m.gradient
                            )}
                          >
                            <Icon className={cn('h-6 w-6', m.color)} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            {m.isNew && !isDone && (
                              <Badge className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-[10px] font-bold px-1.5 py-0 border-0 shadow-sm">
                                NEW
                              </Badge>
                            )}
                            {isDone ? (
                              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 gap-1 border border-emerald-300 dark:border-emerald-800 text-[11px]">
                                <CheckCircle2 className="h-3 w-3" /> Done
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[11px] text-muted-foreground font-normal">
                                {m.estimatedTime}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                            {m.name}
                            <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" />
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {m.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {(m.sensors || []).map((s) => {
                            const SensorIcon = sensorLabels[s]?.icon || Activity
                            return (
                              <span
                                key={s}
                                className="inline-flex items-center gap-1 rounded bg-muted/80 px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                <SensorIcon className="h-2.5 w-2.5" />
                                {sensorLabels[s]?.label || s}
                              </span>
                            )
                          })}
                        </div>

                        {isDone && (
                          <div className="pt-2 border-t flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">Risk score</span>
                            <span
                              className={cn(
                                'text-sm font-bold font-mono',
                                result!.riskScore < 30
                                  ? 'text-emerald-600'
                                  : result!.riskScore < 60
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              )}
                            >
                              {result!.riskScore}/100
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Corporate Spotlight: NSVAIR Diagnosis & NSVAIR GROUP OF INDUSTRY */}
            <Card id="about-nsvair" className="border bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-background dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-background">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">NSVAIR GROUP OF INDUSTRY</h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold tracking-wide">
                        Enterprise AI Innovation &amp; Healthcare Diagnostics Division
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-background/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <Award className="h-3.5 w-3.5 mr-1" /> Flagship Health AI Platform
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5 p-3 rounded-lg bg-background/60 border">
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                      <Cpu className="h-4 w-4" /> Agentic Multi-Agent AI
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      NSVAIR Diagnosis employs autonomous domain-specialized vision, speech, and clinical reasoning agents engineered under NSVAIR GROUP OF INDUSTRY.
                    </p>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-lg bg-background/60 border">
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                      <Lock className="h-4 w-4" /> Zero-Retention Privacy
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Zero server image persistence. Signals are evaluated in real time in memory, ensuring personal biometric and audio data remains completely private.
                    </p>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-lg bg-background/60 border">
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                      <Globe className="h-4 w-4" /> Free Global Healthcare Access
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Part of NSVAIR GROUP OF INDUSTRY&apos;s mission to democratize preventative health screening for every smartphone owner worldwide.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy notice */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-4 flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Your biometric privacy is protected</p>
                  <p>
                    All diagnostic images, sensor logs, and voice recordings are processed in real-time by AI and are never retained on our servers. Diagnostic reports are stored locally in your browser.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How it works */}
            <section id="how-it-works" className="space-y-3 scroll-mt-20">
              <h2 className="text-xl font-bold">How NSVAIR Diagnosis Works</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NSVAIR Diagnosis turns your standard smartphone into a 16-in-1 multi-modal clinical screening station.
                Using your phone&apos;s camera, microphone, motion sensors, and touch screen, specialized AI agents analyze
                independent health indicators and synthesize them into one cohesive health report.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <Card className="bg-muted/20">
                  <CardContent className="p-4 space-y-1.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <Camera className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-sm">1. Multi-Sensor Capture</h3>
                    <p className="text-xs text-muted-foreground">
                      Capture optical, audio, movement, and interactive signals using your device sensors.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-4 space-y-1.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-sm">2. Agentic AI Analysis</h3>
                    <p className="text-xs text-muted-foreground">
                      Deep neural vision, acoustic ASR, and reasoning agents analyze your signals in real time.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-4 space-y-1.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-sm">3. Synthesis Report</h3>
                    <p className="text-xs text-muted-foreground">
                      A central medical synthesis agent correlates cross-module findings, red flags, and next steps.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Why choose */}
            <section id="features" className="space-y-3 scroll-mt-20">
              <h2 className="text-xl font-bold">Why Choose NSVAIR Diagnosis?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">100% Free &amp; Instant Access</h3>
                    <p className="text-xs text-muted-foreground">
                      No paywalls, subscriptions, or login requirements. Run all 16 diagnostic modules and export comprehensive health reports completely free.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">Backed by NSVAIR GROUP OF INDUSTRY</h3>
                    <p className="text-xs text-muted-foreground">
                      Built upon enterprise AI engineering, robust infrastructure, and continuous algorithmic improvements from the NSVAIR GROUP OF INDUSTRY team.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">16 Specialized AI Modules</h3>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive coverage: Dermatology, Ophthalmology, Dental, Nail, Hair, Posture, Voice/Cough, rPPG Vitals, Mental Health, Sleep, Nutrition, Hearing, Vision &amp; Reactions.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">Universal PWA Compatibility</h3>
                    <p className="text-xs text-muted-foreground">
                      Install seamlessly on Android, iOS, Windows, and macOS with one tap. Works offline and provides a native app experience.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* NSVAIR Medical Store Hub Banner */}
            <section id="store-banner" className="space-y-3 scroll-mt-20">
              <Card className="overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-background to-teal-950/40 shadow-md">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-600 text-white font-bold text-[10px]">
                        NEW • 500+ PRODUCTS
                      </Badge>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Official Medical Marketplace
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                      NSVAIR Diagnosis Hardware &amp; Clinical Pass Store
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      Equip your home clinic or practice with handheld wireless ultrasound probes, smart dermatoscopes, at-home blood test kits, and multi-modal AI screening credits. ISO 13485 certified with rapid worldwide clinic delivery.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-foreground pt-1">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        100% Medical Grade
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-4 w-4 text-sky-500" />
                        Free Clinical Shipping
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-amber-500" />
                        FDA &amp; CE Registered
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
                    <Link href="/store" className="w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6 shadow-sm gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Explore 500+ Store Items</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <a
                      href="https://wa.me/919599497690?text=Hello%20NSVAIR%20Diagnosis%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20medical%20products."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full text-xs font-semibold h-10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-2"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Order via WhatsApp (+91 9599497690)</span>
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* FAQ section */}
            <section id="faq" className="space-y-3 scroll-mt-20">
              <h2 className="text-xl font-bold">
                Frequently Asked Questions
              </h2>
              <Card>
                <CardContent className="p-2">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="faq-1" className="border-b">
                      <AccordionTrigger className="text-sm font-medium px-3">
                        What is NSVAIR Diagnosis?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">
                        NSVAIR Diagnosis is an agentic AI-powered multi-modal health screening platform developed by NSVAIR GROUP OF INDUSTRY. It utilizes your smartphone&apos;s camera, microphone, motion sensors, and touch screen to conduct 16 comprehensive health evaluations and synthesizes them into one actionable health report.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-2" className="border-b">
                      <AccordionTrigger className="text-sm font-medium px-3">
                        What is NSVAIR GROUP OF INDUSTRY?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">
                        NSVAIR GROUP OF INDUSTRY is a diversified technology group developing frontier artificial intelligence, multi-modal diagnostic systems, and intelligent digital platforms. NSVAIR Diagnosis operates as the primary digital health division of NSVAIR GROUP OF INDUSTRY.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-3" className="border-b">
                      <AccordionTrigger className="text-sm font-medium px-3">
                        Is NSVAIR Diagnosis a certified medical device?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">
                        No. NSVAIR Diagnosis is an AI-powered screening and informational wellness tool, not a certified medical diagnostic device. Always consult a licensed healthcare professional for clinical diagnosis, prescriptions, and medical treatment.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-4" className="border-b">
                      <AccordionTrigger className="text-sm font-medium px-3">
                        How does camera-based rPPG heart rate measurement work?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">
                        Remote photoplethysmography (rPPG) detects subtle micro-changes in skin light absorption caused by arterial blood pulsation. By analyzing video frames from your smartphone camera, the AI accurately estimates pulse and respiratory rate.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-5" className="border-b">
                      <AccordionTrigger className="text-sm font-medium px-3">
                        Is my personal health data private and safe?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">
                        Yes. All sensor signals, audio files, and images are analyzed in real time in memory and never stored permanently on external servers. Saved reports remain inside your browser storage under your direct control.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-6" className="border-b">
                      <AccordionTrigger className="text-sm font-medium px-3">
                        How much does NSVAIR Diagnosis cost?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">
                        NSVAIR Diagnosis is 100% free. All 16 diagnostic modules, AI analysis agents, and comprehensive health synthesis reports are freely accessible.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-7">
                      <AccordionTrigger className="text-sm font-medium px-3">
                        Can I download and share my health report?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">
                        Yes. After running any number of screenings, click &quot;Report&quot; to synthesize all findings. You can view, save to history, or download a formatted text health report to share with your doctor.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            {/* Keyword rich footer notes */}
            <section className="text-xs text-muted-foreground leading-relaxed space-y-2 pt-2 border-t">
              <h2 className="text-sm font-semibold text-foreground">
                NSVAIR Diagnosis — 16 Intelligent Health Modules
              </h2>
              <p>
                NSVAIR Diagnosis delivers sixteen specialized screening tools: <strong>AI Skin &amp; Dermatology Analyzer</strong> (ABCDE criteria), <strong>AI Eye Health Checker</strong>, <strong>Facial Wellness &amp; Hydration Assessment</strong>, <strong>Dental &amp; Oral Health Checker</strong>, <strong>Nail Health Analyzer</strong>, <strong>Hair &amp; Scalp Density Check</strong>, <strong>Posture &amp; Ergonomic Alignment</strong>, <strong>Voice &amp; Cough Respiratory Analyzer</strong> (ASR speech), <strong>Conversational AI Symptom Checker</strong>, <strong>Vital Signs Monitor</strong> (rPPG heart rate), <strong>Mental Health Screening</strong> (PHQ/GAD questionnaires), <strong>Sleep Quality Assessment</strong> (PSQI index), <strong>Nutrition &amp; Dietary Check</strong>, <strong>Visual Acuity &amp; Color Vision Test</strong> (Ishihara plates), <strong>Tone Frequency Hearing Test</strong>, and <strong>Reaction Time &amp; Motor Balance Test</strong>.
              </p>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-background/90 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-sm">
                  <HeartPulse className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-extrabold text-base leading-tight block">
                    NSVAIR <span className="text-emerald-600">Diagnosis</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Powered by NSVAIR GROUP OF INDUSTRY
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                NSVAIR Diagnosis is the agentic AI healthcare and screening platform developed by <strong>NSVAIR GROUP OF INDUSTRY</strong>. Integrating 16 multi-modal sensors to deliver real-time health intelligence worldwide.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className="text-[10px] bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                  <Building2 className="h-3 w-3 mr-1" /> NSVAIR GROUP OF INDUSTRY
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  Agentic AI v2.1
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Screening Modules</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">Skin &amp; Dermatology</a></li>
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">Eye &amp; Facial Wellness</a></li>
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">Dental, Nail &amp; Hair</a></li>
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">Vital Signs (rPPG)</a></li>
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">Voice, Cough &amp; Symptoms</a></li>
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">Mental Health &amp; Sleep</a></li>
                <li><a href="#modules" className="hover:text-emerald-600 transition-colors">Vision &amp; Hearing Tests</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Group &amp; Platform</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link href="/store" className="hover:text-emerald-600 transition-colors font-semibold text-emerald-600">🛍️ Medical Store (500+ Items)</Link></li>
                <li><a href="#about-nsvair" className="hover:text-emerald-600 transition-colors">About NSVAIR GROUP</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How AI Diagnostics Work</a></li>
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">Platform Features</a></li>
                <li><a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ &amp; Support</a></li>
                <li><Link href="/admin" className="hover:text-emerald-600 transition-colors text-[11px] opacity-75 hover:opacity-100">⚙️ Super Admin Panel</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-5 space-y-2 text-center">
            <p className="text-xs text-muted-foreground max-w-3xl mx-auto">
              <strong>Medical Disclaimer:</strong> NSVAIR Diagnosis is an AI-assisted screening and informational wellness tool developed under NSVAIR GROUP OF INDUSTRY. It is not a certified medical device and is not intended to replace clinical examination, professional medical advice, diagnosis, or treatment. Always consult a licensed medical doctor for health concerns.
            </p>
            <p className="text-[11px] text-muted-foreground/80 font-medium">
              © {new Date().getFullYear()} NSVAIR Diagnosis · Powered by NSVAIR GROUP OF INDUSTRY. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Report sheet */}
      <Sheet open={reportOpen} onOpenChange={setReportOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto"
        >
          <SheetHeader className="px-6">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Comprehensive Health Report
            </SheetTitle>
            <SheetDescription>
              AI-synthesized multi-modal report powered by NSVAIR GROUP OF INDUSTRY
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 pb-6">
            <HealthReport onClose={() => setReportOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Profile sheet */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="px-6">
            <SheetTitle>Your Health Profile</SheetTitle>
            <SheetDescription>
              Personalizes AI diagnosis findings and recommendations
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 pb-6">
            <UserProfileCard />
          </div>
        </SheetContent>
      </Sheet>

      {/* Shopping Cart Drawer */}
      <CartDrawer />

      {/* Floating Shopping Cart Trigger */}
      {totalCartCount > 0 && (
        <button
          onClick={toggleCart}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Open Shopping Cart"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-6 min-w-[24px] px-1 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs flex items-center justify-center shadow-md border-2 border-background">
            {totalCartCount}
          </span>
        </button>
      )}

      {/* Patient Registration / Login Verification Modal */}
      <AuthModal />

      {/* PWA one-click install banner (Android & iOS) */}
      <PWAInstall />
    </div>
  )
}

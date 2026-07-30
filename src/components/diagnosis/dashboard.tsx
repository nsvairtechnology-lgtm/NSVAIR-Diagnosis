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
} from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import { MODULES, type ModuleId } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { HealthReport } from '@/components/diagnosis/health-report'
import { UserProfileCard } from '@/components/diagnosis/user-profile-card'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hand,
  Eye,
  Smile,
  Mic,
  Stethoscope,
  Brain,
  HeartPulse,
  Timer,
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
    activeModule,
    setActiveModule,
    results,
    clearAllResults,
    completedCount,
  } = useDiagnosisStore()

  const [reportOpen, setReportOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)

  const totalModules = MODULES.length
  const completed = completedCount()
  const progress = (completed / totalModules) * 100

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
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">
                MediScan <span className="text-emerald-600">AI</span>
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Agentic Diagnostic Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:flex gap-1.5">
              <Sparkles className="h-3 w-3 text-emerald-500" />
              {completed}/{totalModules} done
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setProfileOpen(true)}
              className="gap-1.5"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setReportOpen(true)}
              disabled={completed === 0}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report</span>
            </Button>
          </div>
        </div>
        {/* progress bar */}
        <div className="h-0.5 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
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
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> All Modules
              </Button>
              <div className="flex items-center gap-2">
                {results[active.id] && (
                  <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
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
                  'h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center',
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
            {/* Hero */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
              <CardContent className="p-6 md:p-8 relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_50%)]" />
                <div className="relative space-y-4 max-w-2xl">
                  <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 gap-1.5">
                    <Sparkles className="h-3 w-3" /> Powered by Agentic AI
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                    Complete health diagnostics — all in one place, in real time.
                  </h2>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    MediScan AI uses your phone&apos;s camera, microphone, motion sensors, and touch to run
                    8 different AI-powered diagnostic screenings. Get a complete, integrated health
                    report in minutes.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.values(sensorLabels).map((s) => {
                      const Icon = s.icon
                      return (
                        <span
                          key={s.label}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium"
                        >
                          <Icon className="h-3 w-3" /> {s.label}
                        </span>
                      )
                    })}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                      <Wifi className="h-3 w-3" /> Real-time AI
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress summary */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      Your Diagnostic Progress
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Complete modules to build your comprehensive health report.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">
                        {completed}
                        <span className="text-sm text-muted-foreground">/{totalModules}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">modules</p>
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
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Diagnostic Modules</h3>
                <span className="text-xs text-muted-foreground">Tap a module to start</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {MODULES.map((m) => {
                  const Icon = iconMap[m.icon] || Activity
                  const result = results[m.id]
                  const isDone = !!result
                  return (
                    <Card
                      key={m.id}
                      onClick={() => setActiveModule(m.id)}
                      className={cn(
                        'group cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden',
                        isDone && 'ring-1 ring-emerald-500/40'
                      )}
                    >
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div
                            className={cn(
                              'h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center',
                              m.gradient
                            )}
                          >
                            <Icon className={cn('h-6 w-6', m.color)} />
                          </div>
                          {isDone ? (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Done
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" /> {m.estimatedTime}
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{m.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {m.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {m.sensors.length === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground">
                              <Stethoscope className="h-2.5 w-2.5" /> AI Chat
                            </span>
                          ) : (
                            m.sensors.map((s) => {
                              const SIcon = sensorLabels[s]?.icon
                              return (
                                <span
                                  key={s}
                                  className="inline-flex items-center gap-1 text-[10px] rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground"
                                >
                                  {SIcon && <SIcon className="h-2.5 w-2.5" />}
                                  {sensorLabels[s]?.label}
                                </span>
                              )
                            })
                          )}
                        </div>
                        {isDone && (
                          <div className="pt-2 border-t flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Risk score</span>
                            <span
                              className={cn(
                                'text-sm font-semibold',
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

            {/* Privacy notice */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-4 flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Your privacy is protected</p>
                  <p>
                    All images and audio are processed securely by the AI and are not stored on our
                    servers. Diagnosis reports are saved locally to your device for your records.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            <strong>MediScan AI</strong> — Not a medical device. For screening and informational
            purposes only. Always consult a licensed healthcare professional for diagnosis and
            treatment.
          </p>
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
              AI-synthesized summary across all completed diagnostic modules
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
              Helps the AI personalize your diagnosis (optional)
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 pb-6">
            <UserProfileCard />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

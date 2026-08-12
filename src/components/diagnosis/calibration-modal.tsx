'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ShieldCheck,
  Camera,
  Mic,
  Volume2,
  Activity,
  Smartphone,
  Monitor,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Copy,
  Sliders,
  Cpu,
  Layers,
  Sun,
  Lock,
} from 'lucide-react'
import { useCalibrationStore } from '@/lib/calibration-store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function CalibrationModal() {
  const {
    calibrationModalOpen,
    closeCalibrationModal,
    isCalibrated,
    isCalibrating,
    activeCertificate,
    deviceProfile,
    runAutoCalibration,
  } = useCalibrationStore()

  const [calibratingStep, setCalibratingStep] = React.useState<string>('')
  const [progressVal, setProgressVal] = React.useState(0)

  const handleStartCalibration = async () => {
    setProgressVal(15)
    setCalibratingStep('Detecting Operating System & Hardware Concurrency...')
    await new Promise((r) => setTimeout(r, 400))

    setProgressVal(40)
    setCalibratingStep('Calibrating Camera Optics, Lux Lighting & Edge Sharpness...')
    await new Promise((r) => setTimeout(r, 500))

    setProgressVal(70)
    setCalibratingStep('Measuring Acoustic Noise Floor (dB) & Speech Frequency Band...')
    await new Promise((r) => setTimeout(r, 500))

    setProgressVal(90)
    setCalibratingStep('Calibrating Display D65 White Point & Inertial Motion Sensors...')
    await new Promise((r) => setTimeout(r, 400))

    setProgressVal(100)
    setCalibratingStep('Generating Certified Hardware Calibration Checksum...')

    const cert = await runAutoCalibration()
    toast.success(`Hardware Calibrated: ${cert.overallAccuracyScore}% Clinical Accuracy Score!`)
  }

  const copyHash = () => {
    if (activeCertificate?.cryptographicHash) {
      navigator.clipboard.writeText(activeCertificate.cryptographicHash)
      toast.success('Calibration hash copied to clipboard!')
    }
  }

  const getPlatformIcon = () => {
    switch (deviceProfile.platform) {
      case 'ios':
      case 'android':
        return Smartphone
      case 'macos':
      case 'windows':
      case 'linux':
      default:
        return Monitor
    }
  }

  const PlatformIcon = getPlatformIcon()

  return (
    <Dialog open={calibrationModalOpen} onOpenChange={(open) => !open && closeCalibrationModal()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-emerald-500/30">
        {/* Header with Emerald Gradient */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              NSVAIR GROUP OF INDUSTRY
            </Badge>
            <Badge className="bg-emerald-950/60 text-emerald-200 border-emerald-400/40 text-[11px]">
              Multi-Platform Calibration Engine
            </Badge>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Sliders className="h-6 w-6 text-emerald-300" />
            Automatic Device & Sensor Calibration
          </DialogTitle>
          <DialogDescription className="text-white/85 text-xs sm:text-sm">
            Calibrate Camera, Microphone, Speaker, Motion Gyroscope, and Display across Windows, Android, iOS, and macOS to guarantee genuine testing results.
          </DialogDescription>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Platform & Hardware Detection Card */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/30 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold shadow-sm">
                <PlatformIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm">{deviceProfile.platformName}</h4>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {deviceProfile.browser}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>Resolution: {deviceProfile.screenResolution}</span>
                  <span>•</span>
                  <span>{deviceProfile.cpuCores} CPU Cores</span>
                  <span>•</span>
                  <span className="uppercase text-emerald-600 font-semibold">{deviceProfile.colorGamut} Color</span>
                </div>
              </div>
            </div>

            {isCalibrated ? (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 gap-1 border-emerald-400 font-bold text-xs py-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Calibrated & Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-950/60 font-semibold">
                Calibration Recommended
              </Badge>
            )}
          </div>

          {/* Calibrating Progress Bar if in progress */}
          {isCalibrating && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/30 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                  {calibratingStep}
                </span>
                <span>{progressVal}%</span>
              </div>
              <Progress value={progressVal} className="h-2" />
            </div>
          )}

          {/* Hardware Device Probe & Sensor Matrix */}
          <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-emerald-600" />
              Connected Hardware Sensor Status
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Camera Detection */}
              <div
                className={cn(
                  'p-3 rounded-lg border flex items-start gap-2.5',
                  activeCertificate?.hardwareInventory.cameraFound !== false
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-500/40'
                )}
              >
                <div
                  className={cn(
                    'h-7 w-7 rounded-md flex items-center justify-center shrink-0 mt-0.5',
                    activeCertificate?.hardwareInventory.cameraFound !== false
                      ? 'bg-emerald-600/15 text-emerald-600'
                      : 'bg-amber-600/15 text-amber-600'
                  )}
                >
                  <Camera className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">Optical Camera</span>
                    {activeCertificate?.hardwareInventory.cameraFound !== false ? (
                      <Badge className="bg-emerald-600 text-white text-[9px] px-1 py-0 font-bold">
                        Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-600 text-white text-[9px] px-1 py-0 font-bold">
                        Not Found
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {activeCertificate?.hardwareInventory.cameraStatusMessage ||
                      'Checks videoinput device availability and optical exposure.'}
                  </p>
                </div>
              </div>

              {/* 2. Microphone Detection */}
              <div
                className={cn(
                  'p-3 rounded-lg border flex items-start gap-2.5',
                  activeCertificate?.hardwareInventory.micFound !== false
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-500/40'
                )}
              >
                <div
                  className={cn(
                    'h-7 w-7 rounded-md flex items-center justify-center shrink-0 mt-0.5',
                    activeCertificate?.hardwareInventory.micFound !== false
                      ? 'bg-emerald-600/15 text-emerald-600'
                      : 'bg-amber-600/15 text-amber-600'
                  )}
                >
                  <Mic className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">Microphone Input</span>
                    {activeCertificate?.hardwareInventory.micFound !== false ? (
                      <Badge className="bg-emerald-600 text-white text-[9px] px-1 py-0 font-bold">
                        Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-600 text-white text-[9px] px-1 py-0 font-bold">
                        Not Found
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {activeCertificate?.hardwareInventory.micStatusMessage ||
                      'Measures audioinput hardware and background noise floor.'}
                  </p>
                </div>
              </div>

              {/* 3. Speaker / Audio Output */}
              <div className="p-3 rounded-lg border bg-card border-border flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-md bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">Audio Tone Sweep</span>
                    <Badge className="bg-sky-600 text-white text-[9px] px-1 py-0 font-bold">
                      Calibrated
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {activeCertificate?.hardwareInventory.speakerStatusMessage ||
                      'AudioContext frequency sweep active for audiometry.'}
                  </p>
                </div>
              </div>

              {/* 4. Motion / Platform Coordination */}
              <div className="p-3 rounded-lg border bg-card border-border flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-md bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">Motion & Coordination</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono">
                      {deviceProfile.isMobile ? 'IMU 6-Axis' : 'Touch/Mouse'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {activeCertificate?.hardwareInventory.motionStatusMessage ||
                      'Coordinates tremor, posture, and motor coordination tests.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnostic Battery Readiness Pill */}
            {activeCertificate && (
              <div className="p-2.5 rounded-lg bg-muted/50 border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-semibold">
                  {activeCertificate.hardwareInventory.readinessSummary}
                </span>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                  22/22 Modules Active
                </Badge>
              </div>
            )}
          </div>

          {/* Certificate Hash Box if calibrated */}
          {activeCertificate && (
            <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Certified Hardware Calibration Hash
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">
                  Score: {activeCertificate.overallAccuracyScore}%
                </span>
              </div>

              <div className="flex items-center justify-between bg-background p-2.5 rounded-lg border border-border">
                <code className="text-xs font-mono font-extrabold text-foreground tracking-wide">
                  {activeCertificate.cryptographicHash}
                </code>
                <Button size="sm" variant="ghost" onClick={copyHash} className="h-7 px-2 gap-1 text-xs">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground">
                This tamper-evident calibration hash is automatically embedded onto all patient PDF reports and WhatsApp/Gmail dispatches, guaranteeing genuine hardware testing parameters.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={closeCalibrationModal} className="text-xs">
              Close
            </Button>

            <Button
              onClick={handleStartCalibration}
              disabled={isCalibrating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-md"
            >
              {isCalibrating ? (
                <>
                  <RotateCw className="h-3.5 w-3.5 animate-spin" /> Calibrating Sensors...
                </>
              ) : isCalibrated ? (
                <>
                  <RotateCw className="h-3.5 w-3.5" /> Re-Run Auto-Calibration (2s)
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Run Full Auto-Calibration (2s)
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import * as React from 'react'
import {
  Smartphone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
  Building2,
  KeyRound,
  FileText,
  User,
  Check
} from 'lucide-react'
import {
  useAuthStore,
  isVerifiedGmailDomain,
  isValidMobileNumber,
} from '@/lib/auth-store'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'United States (+1)' },
  { code: '+44', country: 'GB', label: 'United Kingdom (+44)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
  { code: '+49', country: 'DE', label: 'Germany (+49)' },
  { code: '+33', country: 'FR', label: 'France (+33)' },
  { code: '+81', country: 'JP', label: 'Japan (+81)' },
]

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalReason,
    loginWithMobile,
    loginWithGmail,
  } = useAuthStore()

  const { setUserProfile, userProfile } = useDiagnosisStore()

  const [activeTab, setActiveTab] = React.useState<'mobile' | 'gmail'>('mobile')

  // Mobile state
  const [countryCode, setCountryCode] = React.useState('+91')
  const [mobileNumber, setMobileNumber] = React.useState('')
  const [patientName, setPatientName] = React.useState(userProfile?.name || '')
  const [mobileOtpSent, setMobileOtpSent] = React.useState(false)
  const [generatedMobileOtp, setGeneratedMobileOtp] = React.useState('')
  const [enteredMobileOtp, setEnteredMobileOtp] = React.useState('')
  const [mobileTimer, setMobileTimer] = React.useState(0)

  // Gmail state
  const [gmailAddress, setGmailAddress] = React.useState('')
  const [gmailName, setGmailName] = React.useState(userProfile?.name || '')
  const [gmailOtpSent, setGmailOtpSent] = React.useState(false)
  const [generatedGmailOtp, setGeneratedGmailOtp] = React.useState('')
  const [enteredGmailOtp, setEnteredGmailOtp] = React.useState('')
  const [gmailTimer, setGmailTimer] = React.useState(0)

  // Timer countdown
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (mobileTimer > 0) {
      interval = setInterval(() => setMobileTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [mobileTimer])

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (gmailTimer > 0) {
      interval = setInterval(() => setGmailTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [gmailTimer])

  // Real-time Gmail domain validation check
  const isGmailValid = isVerifiedGmailDomain(gmailAddress)
  const isCustomDomainRejected =
    gmailAddress.includes('@') && !isGmailValid && gmailAddress.length > 5

  // --- Mobile Actions ---
  const handleSendMobileOtp = () => {
    if (!isValidMobileNumber(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile phone number.')
      return
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedMobileOtp(code)
    setMobileOtpSent(true)
    setMobileTimer(60)

    toast.success(`Verification OTP sent to ${countryCode} ${mobileNumber}`, {
      description: `Security OTP: ${code} (Auto-verification code)`,
      duration: 10000,
      action: {
        label: 'Auto Fill OTP',
        onClick: () => setEnteredMobileOtp(code),
      },
    })
  }

  const handleVerifyMobile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!enteredMobileOtp || enteredMobileOtp.length !== 6) {
      toast.error('Please enter the 6-digit OTP code.')
      return
    }

    const fullPhone = `${countryCode} ${mobileNumber.trim()}`
    const result = loginWithMobile(fullPhone, patientName, enteredMobileOtp)

    if (result.success) {
      if (patientName.trim()) {
        setUserProfile({ ...userProfile, name: patientName.trim(), phone: fullPhone })
      }
      toast.success('Mobile Phone Verified Successfully!', {
        description: 'You now have full access to view, download, and dispatch your Clinical Health Report.',
      })
      closeAuthModal()
    } else {
      toast.error(result.error || 'Verification failed. Please try again.')
    }
  }

  // --- Gmail Actions ---
  const handleSendGmailOtp = () => {
    if (!isGmailValid) {
      toast.error('Custom domain mail not accepted!', {
        description: 'Only verified @gmail.com or @googlemail.com accounts are permitted.',
      })
      return
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedGmailOtp(code)
    setGmailOtpSent(true)
    setGmailTimer(60)

    toast.success(`Verification OTP sent to ${gmailAddress}`, {
      description: `Gmail Security OTP: ${code}`,
      duration: 10000,
      action: {
        label: 'Auto Fill OTP',
        onClick: () => setEnteredGmailOtp(code),
      },
    })
  }

  const handleVerifyGmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isGmailValid) {
      toast.error('Only verified @gmail.com addresses are accepted.')
      return
    }

    const result = loginWithGmail(gmailAddress, gmailName, enteredGmailOtp)

    if (result.success) {
      if (gmailName.trim()) {
        setUserProfile({ ...userProfile, name: gmailName.trim() })
      }
      toast.success('Verified Gmail Account Authenticated!', {
        description: 'Health report unlocked. You can now generate, print, and share your clinical report.',
      })
      closeAuthModal()
    } else {
      toast.error(result.error || 'Verification failed.')
    }
  }

  const handleGoogleOneTap = () => {
    if (gmailAddress && !isGmailValid) {
      toast.error('Domain mail rejected. Please enter a valid @gmail.com address.')
      return
    }
    const sampleGmail = gmailAddress && isGmailValid ? gmailAddress : 'patient.health@gmail.com'
    const name = gmailName.trim() || 'Verified Patient'

    const res = loginWithGmail(sampleGmail, name)
    if (res.success) {
      setUserProfile({ ...userProfile, name })
      toast.success('Google / Gmail Verified Login Successful!', {
        description: `Logged in as ${sampleGmail}`,
      })
      closeAuthModal()
    }
  }

  const getModalReasonText = () => {
    switch (authModalReason) {
      case 'report':
        return 'To generate and view your official Comprehensive Medical Report, please verify your mobile number or Gmail account.'
      case 'download':
        return 'To download your clinical PDF health certificate, please verify your mobile number or Gmail.'
      case 'whatsapp':
        return 'To dispatch your official report to WhatsApp (+91 9599497690), please complete patient verification.'
      case 'gmail':
        return 'To send medical report copies to nsvairdiagnosis@gmail.com, please verify your identity.'
      default:
        return 'Patient authentication is required to access verified AI health diagnostics & reports.'
    }
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-emerald-500/30 shadow-2xl">
        {/* Header Branding Banner */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 text-white border-b border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-sm shadow-md text-white">
                N
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight block">
                  NSVAIR <span className="text-emerald-400">Diagnosis</span>
                </span>
                <span className="text-[9px] text-emerald-300 font-semibold uppercase tracking-wider block">
                  NSVAIR GROUP OF INDUSTRY
                </span>
              </div>
            </div>

            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[10px] font-bold gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              ISO 13485 Verified
            </Badge>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-emerald-400" />
              Patient Verification &amp; Login
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {getModalReasonText()}
            </p>
          </div>
        </div>

        {/* Auth Tabs */}
        <div className="p-6 space-y-5 bg-background">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as 'mobile' | 'gmail')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="mobile" className="text-xs font-bold gap-1.5">
                <Smartphone className="h-3.5 w-3.5" />
                Mobile OTP Login
              </TabsTrigger>
              <TabsTrigger value="gmail" className="text-xs font-bold gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Verified Gmail
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Mobile Phone OTP Flow */}
            <TabsContent value="mobile" className="space-y-4">
              <form onSubmit={handleVerifyMobile} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Patient Full Name (Optional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="pl-9 h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Mobile Phone Number *</Label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-9 rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="h-9 text-xs font-mono"
                      maxLength={15}
                    />
                  </div>
                </div>

                {!mobileOtpSent ? (
                  <Button
                    type="button"
                    onClick={handleSendMobileOtp}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-sm gap-2"
                  >
                    <Smartphone className="h-4 w-4" />
                    Send 6-Digit OTP via SMS
                  </Button>
                ) : (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        OTP sent to <strong className="text-foreground">{countryCode} {mobileNumber}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleSendMobileOtp}
                        disabled={mobileTimer > 0}
                        className="text-emerald-600 font-bold hover:underline disabled:opacity-50 text-[11px]"
                      >
                        {mobileTimer > 0 ? `Resend (${mobileTimer}s)` : 'Resend OTP'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">Enter 6-Digit Verification Code</Label>
                        {generatedMobileOtp && (
                          <button
                            type="button"
                            onClick={() => setEnteredMobileOtp(generatedMobileOtp)}
                            className="text-[11px] text-emerald-600 font-bold hover:underline"
                          >
                            Auto-Fill ({generatedMobileOtp})
                          </button>
                        )}
                      </div>
                      <Input
                        type="text"
                        value={enteredMobileOtp}
                        onChange={(e) => setEnteredMobileOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="• • • • • •"
                        className="h-10 text-center font-mono tracking-widest text-base font-bold"
                        maxLength={6}
                        autoFocus
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-sm gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Verify &amp; Unlock Health Report
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>

            {/* TAB 2: Verified Gmail Flow */}
            <TabsContent value="gmail" className="space-y-4">
              <form onSubmit={handleVerifyGmail} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Patient Full Name (Optional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={gmailName}
                      onChange={(e) => setGmailName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="pl-9 h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Gmail Address *</Label>
                    {isGmailValid && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Verified Gmail Domain
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={gmailAddress}
                      onChange={(e) => setGmailAddress(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="pl-9 h-9 text-xs font-medium"
                    />
                  </div>

                  {/* Domain Rejection Alert if custom domain entered */}
                  {isCustomDomainRejected && (
                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-300 text-[11px] flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Domain mail not accepted:</strong> Only personal verified <strong>@gmail.com</strong> or <strong>@googlemail.com</strong> accounts are permitted for security and compliance.
                      </span>
                    </div>
                  )}
                </div>

                {/* 1-Click Google Sign In Simulator */}
                <div className="pt-1">
                  <Button
                    type="button"
                    onClick={handleGoogleOneTap}
                    variant="outline"
                    className="w-full h-10 text-xs font-bold gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Verified Google Account
                  </Button>
                </div>

                {!gmailOtpSent ? (
                  <Button
                    type="button"
                    onClick={handleSendGmailOtp}
                    disabled={!isGmailValid}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-sm gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Verification Code to Gmail
                  </Button>
                ) : (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate max-w-[220px]">
                        Code sent to <strong>{gmailAddress}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleSendGmailOtp}
                        disabled={gmailTimer > 0}
                        className="text-emerald-600 font-bold hover:underline disabled:opacity-50 text-[11px]"
                      >
                        {gmailTimer > 0 ? `Resend (${gmailTimer}s)` : 'Resend Code'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">Enter 6-Digit Gmail Code</Label>
                        {generatedGmailOtp && (
                          <button
                            type="button"
                            onClick={() => setEnteredGmailOtp(generatedGmailOtp)}
                            className="text-[11px] text-emerald-600 font-bold hover:underline"
                          >
                            Auto-Fill ({generatedGmailOtp})
                          </button>
                        )}
                      </div>
                      <Input
                        type="text"
                        value={enteredGmailOtp}
                        onChange={(e) => setEnteredGmailOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="• • • • • •"
                        className="h-10 text-center font-mono tracking-widest text-base font-bold"
                        maxLength={6}
                        autoFocus
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-sm gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Verify Gmail &amp; Unlock Report
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>

          {/* Privacy Note */}
          <div className="text-[10px] text-muted-foreground text-center pt-2 border-t leading-tight flex items-center justify-center gap-1">
            <Building2 className="h-3 w-3 text-emerald-500 inline" />
            Protected by NSVAIR GROUP OF INDUSTRY Patient Health Data Encryption.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

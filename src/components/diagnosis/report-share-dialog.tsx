'use client'

import * as React from 'react'
import {
  MessageCircle,
  Mail,
  Copy,
  Check,
  Send,
  Phone,
  User,
  Share2,
  FileText,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_GMAIL_ADDRESS,
  formatComprehensiveReportWhatsAppMessage,
  formatComprehensiveReportEmail,
  formatSingleTestWhatsAppMessage,
  openWhatsApp,
  openEmail,
  cleanPhoneNumber,
} from '@/lib/report-sharing'
import type { DiagnosisResult, UserProfile } from '@/lib/types'

interface ReportShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report?: {
    overallSummary: string
    overallRiskScore: number
    topFindings: DiagnosisResult['findings']
    prioritizedRecommendations: string[]
    redFlags: string[]
    nextSteps: string[]
    createdAt?: string
  } | null
  singleResult?: DiagnosisResult | null
  results?: DiagnosisResult[]
  userProfile?: UserProfile
}

export function ReportShareDialog({
  open,
  onOpenChange,
  report,
  singleResult,
  results = [],
  userProfile,
}: ReportShareDialogProps) {
  const [phone, setPhone] = React.useState('9599497690')
  const [email, setEmail] = React.useState('nsvairdiagnosis@gmail.com')
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'whatsapp' | 'gmail'>('whatsapp')

  // Generate formatted messages based on whether this is comprehensive or single-test
  const formattedWhatsAppMsg = React.useMemo(() => {
    if (singleResult) {
      return formatSingleTestWhatsAppMessage(singleResult, userProfile)
    }
    if (report) {
      return formatComprehensiveReportWhatsAppMessage(report, results, userProfile)
    }
    return ''
  }, [report, singleResult, results, userProfile])

  const formattedEmailData = React.useMemo(() => {
    if (report) {
      return formatComprehensiveReportEmail(report, results, userProfile)
    }
    if (singleResult) {
      const patientName = userProfile?.name || 'Patient'
      return {
        subject: `[Diagnostic Result] NSVAIR Diagnosis ${singleResult.moduleName} — ${patientName}`,
        body: formattedWhatsAppMsg.replace(/\*/g, ''),
      }
    }
    return { subject: '', body: '' }
  }, [report, singleResult, results, userProfile, formattedWhatsAppMsg])

  const handleSendWhatsApp = () => {
    if (!phone.trim()) {
      toast.error('Please enter a WhatsApp number.')
      return
    }
    openWhatsApp(phone, formattedWhatsAppMsg)
    toast.success(`Opening WhatsApp with report for ${phone}...`)
  }

  const handleSendGmail = () => {
    if (!email.trim()) {
      toast.error('Please enter a recipient Gmail address.')
      return
    }
    openEmail(email, formattedEmailData.subject, formattedEmailData.body, true)
    toast.success(`Opening Gmail compose window for ${email}...`)
  }

  const handleCopy = () => {
    const textToCopy = activeTab === 'whatsapp' ? formattedWhatsAppMsg : `${formattedEmailData.subject}\n\n${formattedEmailData.body}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    toast.success('Formatted medical report copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Send Diagnostic Report via WhatsApp & Gmail
              </DialogTitle>
              <DialogDescription className="text-xs">
                Official clinical dispatch formatted for instant sharing with doctors and patients
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="whatsapp" className="gap-2 text-xs font-semibold">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              WhatsApp Dispatch
            </TabsTrigger>
            <TabsTrigger value="gmail" className="gap-2 text-xs font-semibold">
              <Mail className="h-4 w-4 text-red-500" />
              Gmail / Email Dispatch
            </TabsTrigger>
          </TabsList>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="wa-phone" className="text-xs font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-500" />
                  Recipient WhatsApp Number
                </Label>
                <button
                  type="button"
                  onClick={() => setPhone('9599497690')}
                  className="text-[11px] text-emerald-600 hover:underline font-medium"
                >
                  Reset to 9599497690
                </button>
              </div>
              <div className="flex gap-2">
                <div className="h-9 px-2.5 rounded-md border bg-muted/40 flex items-center text-xs text-muted-foreground font-mono">
                  +91
                </div>
                <Input
                  id="wa-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number (e.g. 9599497690)"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Message Preview */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Formatted WhatsApp Message Preview:</span>
                <span className="text-[10px] text-emerald-600 font-medium">Verified Medical Format</span>
              </div>
              <Textarea
                readOnly
                value={formattedWhatsAppMsg}
                className="font-mono text-[11px] h-48 bg-muted/30 resize-none custom-scroll"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                onClick={handleSendWhatsApp}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-medium shadow-sm text-xs h-9"
              >
                <Send className="h-3.5 w-3.5" />
                Send via WhatsApp to {phone || 'Recipient'}
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </Button>
            </div>
          </TabsContent>

          {/* Gmail Tab */}
          <TabsContent value="gmail" className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="gm-email" className="text-xs font-medium flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-red-500" />
                  Recipient Email Address
                </Label>
                <button
                  type="button"
                  onClick={() => setEmail('nsvairdiagnosis@gmail.com')}
                  className="text-[11px] text-red-600 hover:underline font-medium"
                >
                  Reset to nsvairdiagnosis@gmail.com
                </button>
              </div>
              <Input
                id="gm-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. nsvairdiagnosis@gmail.com, doctor@clinic.com"
                className="h-9 text-xs"
              />
            </div>

            {/* Email Subject & Body Preview */}
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Subject:</Label>
                <Input
                  readOnly
                  value={formattedEmailData.subject}
                  className="h-8 text-xs font-medium bg-muted/30"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Body Preview:</Label>
                <Textarea
                  readOnly
                  value={formattedEmailData.body}
                  className="font-mono text-[11px] h-36 bg-muted/30 resize-none custom-scroll"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                onClick={handleSendGmail}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2 font-medium shadow-sm text-xs h-9"
              >
                <Send className="h-3.5 w-3.5" />
                Open in Gmail Compose
              </Button>
              <Button
                onClick={() => openEmail(email, formattedEmailData.subject, formattedEmailData.body, false)}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9"
              >
                <Mail className="h-3.5 w-3.5" />
                Default Email Client
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

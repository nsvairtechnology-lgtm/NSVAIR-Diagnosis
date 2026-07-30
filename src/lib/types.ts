// Core diagnosis types for NSVAIR Diagnosis

export type ModuleId =
  | 'skin'
  | 'eye'
  | 'face'
  | 'voice'
  | 'symptom'
  | 'mental'
  | 'vitals'
  | 'reaction'

export type Severity = 'normal' | 'mild' | 'moderate' | 'high' | 'critical'

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

export interface Finding {
  condition: string
  confidence: number // 0-1
  severity: Severity
  description: string
  recommendation: string
}

export interface DiagnosisResult {
  moduleId: ModuleId
  moduleName: string
  icon: string
  summary: string
  findings: Finding[]
  riskLevel: RiskLevel
  riskScore: number // 0-100
  rawData?: Record<string, unknown>
  recommendations: string[]
  completedAt: string // ISO
  duration?: number // ms
}

export interface UserProfile {
  name: string
  age: string
  gender: 'male' | 'female' | 'other' | ''
  height?: string
  weight?: string
  conditions?: string
}

export interface ComprehensiveReport {
  id: string
  createdAt: string
  userProfile: UserProfile
  results: DiagnosisResult[]
  overallSummary: string
  overallRiskScore: number
  topFindings: Finding[]
  prioritizedRecommendations: string[]
  redFlags: string[]
  nextSteps: string[]
}

export interface PhoneSensor {
  type: 'camera' | 'microphone' | 'motion' | 'geolocation' | 'touch'
  label: string
  icon: string
  description: string
}

// Module metadata
export interface ModuleMeta {
  id: ModuleId
  name: string
  description: string
  icon: string
  sensors: PhoneSensor['type'][]
  color: string
  gradient: string
  estimatedTime: string
}

export const MODULES: ModuleMeta[] = [
  {
    id: 'skin',
    name: 'Skin & Dermatology',
    description: 'Analyze skin conditions, rashes, moles, and lesions using AI vision',
    icon: 'Hand',
    sensors: ['camera'],
    color: 'text-rose-500',
    gradient: 'from-rose-500/20 to-pink-500/10',
    estimatedTime: '30s',
  },
  {
    id: 'eye',
    name: 'Eye Health',
    description: 'Detect redness, irritation, jaundice, and eye-related conditions',
    icon: 'Eye',
    sensors: ['camera'],
    color: 'text-cyan-500',
    gradient: 'from-cyan-500/20 to-teal-500/10',
    estimatedTime: '30s',
  },
  {
    id: 'face',
    name: 'Facial Wellness',
    description: 'Assess facial symmetry, fatigue signs, and overall wellness indicators',
    icon: 'Smile',
    sensors: ['camera'],
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-orange-500/10',
    estimatedTime: '45s',
  },
  {
    id: 'voice',
    name: 'Voice & Cough',
    description: 'Analyze cough patterns, voice hoarseness, and respiratory indicators',
    icon: 'Mic',
    sensors: ['microphone'],
    color: 'text-violet-500',
    gradient: 'from-violet-500/20 to-purple-500/10',
    estimatedTime: '20s',
  },
  {
    id: 'symptom',
    name: 'Symptom Checker',
    description: 'Conversational AI that analyzes your symptoms and suggests conditions',
    icon: 'Stethoscope',
    sensors: [],
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-green-500/10',
    estimatedTime: '2min',
  },
  {
    id: 'mental',
    name: 'Mental Health',
    description: 'Screening for stress, anxiety, and depression with validated questionnaires',
    icon: 'Brain',
    sensors: [],
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-blue-500/10',
    estimatedTime: '3min',
  },
  {
    id: 'vitals',
    name: 'Vital Signs (rPPG)',
    description: 'Camera-based heart rate estimation, breathing, and stress via motion sensors',
    icon: 'HeartPulse',
    sensors: ['camera', 'motion'],
    color: 'text-red-500',
    gradient: 'from-red-500/20 to-rose-500/10',
    estimatedTime: '45s',
  },
  {
    id: 'reaction',
    name: 'Reaction & Balance',
    description: 'Test reaction time and motor coordination via touch and motion sensors',
    icon: 'Timer',
    sensors: ['touch', 'motion'],
    color: 'text-sky-500',
    gradient: 'from-sky-500/20 to-blue-500/10',
    estimatedTime: '1min',
  },
]

export function getModule(id: ModuleId): ModuleMeta {
  return MODULES.find((m) => m.id === id)!
}

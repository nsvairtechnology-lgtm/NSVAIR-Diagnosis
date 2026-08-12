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
  | 'dental'
  | 'nail'
  | 'hair'
  | 'posture'
  | 'sleep'
  | 'nutrition'
  | 'vision'
  | 'hearing'
  | 'radiology'
  | 'lab-report'
  | 'blood-pressure'
  | 'pupillary-reflex'
  | 'spirometry'
  | 'cognitive-clock'

export type Severity = 'normal' | 'mild' | 'moderate' | 'high' | 'critical'

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

export type ModuleCategory = 'camera' | 'imaging' | 'records' | 'sensors' | 'assessment' | 'audio'

export interface Finding {
  condition: string
  confidence: number // 0-1
  severity: Severity
  description: string
  recommendation: string
}

export interface BiomarkerResult {
  name: string
  value: string
  unit: string
  referenceRange: string
  status: 'normal' | 'high' | 'low' | 'critical'
  explanation: string
}

export interface DiagnosisResult {
  moduleId: ModuleId
  moduleName: string
  icon: string
  category: ModuleCategory
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
  id?: string
  name: string
  age: string
  gender: 'male' | 'female' | 'other' | ''
  relationship?: 'self' | 'spouse' | 'child' | 'parent' | 'other'
  bloodGroup?: string
  dob?: string
  email?: string
  phone?: string
  height?: string
  weight?: string
  bmi?: string
  bmiCategory?: 'Underweight' | 'Normal' | 'Overweight' | 'Obese' | ''
  bloodPressure?: string
  allergies?: string
  conditions?: string
  medications?: string
  emergencyContact?: string
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
  category: ModuleCategory
  color: string
  gradient: string
  estimatedTime: string
  isNew?: boolean
}

export const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  camera: 'Camera AI',
  imaging: 'Radiology & Imaging',
  records: 'Lab Reports & Docs',
  sensors: 'Sensors',
  assessment: 'Assessment',
  audio: 'Audio',
}

export const MODULES: ModuleMeta[] = [
  // === Radiology & Imaging (NEW) ===
  {
    id: 'radiology',
    name: 'X-Ray, MRI & Ultrasound AI',
    description: 'Upload radiographic film (X-Ray, Ultrasound, MRI, CT Scans) for instant multi-modal clinical interpretation',
    icon: 'ScanLine',
    sensors: ['camera'],
    category: 'imaging',
    color: 'text-sky-500',
    gradient: 'from-sky-500/20 to-blue-500/10',
    estimatedTime: '40s',
    isNew: true,
  },
  // === Medical Lab Reports (NEW) ===
  {
    id: 'lab-report',
    name: 'Lab Report & Blood Test AI',
    description: 'Upload blood work, pathology sheets, and medical PDF/image documents for OCR biomarker analysis',
    icon: 'FileText',
    sensors: ['camera'],
    category: 'records',
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    estimatedTime: '35s',
    isNew: true,
  },
  // === Camera AI ===
  {
    id: 'skin',
    name: 'Skin & Dermatology',
    description: 'Analyze skin conditions, rashes, moles, and lesions using AI vision',
    icon: 'Hand',
    sensors: ['camera'],
    category: 'camera',
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
    category: 'camera',
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
    category: 'camera',
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-orange-500/10',
    estimatedTime: '45s',
  },
  {
    id: 'dental',
    name: 'Dental & Oral',
    description: 'Check teeth, gums, and tongue for oral health signs and hygiene',
    icon: 'Pizza',
    sensors: ['camera'],
    category: 'camera',
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 to-amber-500/10',
    estimatedTime: '30s',
  },
  {
    id: 'nail',
    name: 'Nail Health',
    description: 'Detect nail color, ridges, clubbing, and deficiency indicators',
    icon: 'Hand',
    sensors: ['camera'],
    category: 'camera',
    color: 'text-fuchsia-500',
    gradient: 'from-fuchsia-500/20 to-pink-500/10',
    estimatedTime: '30s',
  },
  {
    id: 'hair',
    name: 'Hair & Scalp',
    description: 'Analyze scalp condition, hair density, and hair-loss patterns',
    icon: 'Wind',
    sensors: ['camera'],
    category: 'camera',
    color: 'text-yellow-600',
    gradient: 'from-yellow-500/20 to-amber-500/10',
    estimatedTime: '30s',
  },
  {
    id: 'posture',
    name: 'Posture Analysis',
    description: 'Assess body posture, shoulder alignment, and spinal cues from a photo',
    icon: 'PersonStanding',
    sensors: ['camera'],
    category: 'camera',
    color: 'text-lime-500',
    gradient: 'from-lime-500/20 to-green-500/10',
    estimatedTime: '30s',
  },
  // === Audio ===
  {
    id: 'voice',
    name: 'Voice & Cough',
    description: 'Analyze cough patterns, voice hoarseness, and respiratory indicators',
    icon: 'Mic',
    sensors: ['microphone'],
    category: 'audio',
    color: 'text-violet-500',
    gradient: 'from-violet-500/20 to-purple-500/10',
    estimatedTime: '20s',
  },
  // === Sensors ===
  {
    id: 'vitals',
    name: 'Vital Signs (rPPG)',
    description: 'Camera-based heart rate estimation, breathing, and stress via motion sensors',
    icon: 'HeartPulse',
    sensors: ['camera', 'motion'],
    category: 'sensors',
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
    category: 'sensors',
    color: 'text-sky-500',
    gradient: 'from-sky-500/20 to-blue-500/10',
    estimatedTime: '1min',
  },
  {
    id: 'vision',
    name: 'Vision Test',
    description: 'Screen for color blindness (Ishihara-style) and visual sharpness interactively',
    icon: 'Eye',
    sensors: ['touch'],
    category: 'sensors',
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-blue-500/10',
    estimatedTime: '2min',
  },
  {
    id: 'hearing',
    name: 'Hearing Test',
    description: 'Test hearing thresholds across frequencies using calibrated audio tones',
    icon: 'Ear',
    sensors: ['touch'],
    category: 'sensors',
    color: 'text-teal-500',
    gradient: 'from-teal-500/20 to-cyan-500/10',
    estimatedTime: '2min',
  },
  // === Assessment ===
  {
    id: 'symptom',
    name: 'Symptom Checker',
    description: 'Conversational AI that analyzes your symptoms and suggests conditions',
    icon: 'Stethoscope',
    sensors: [],
    category: 'assessment',
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
    category: 'assessment',
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-blue-500/10',
    estimatedTime: '3min',
  },
  {
    id: 'sleep',
    name: 'Sleep Quality',
    description: 'PSQI-style sleep assessment for insomnia, apnea risk, and sleep hygiene',
    icon: 'Moon',
    sensors: [],
    category: 'assessment',
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-indigo-500/10',
    estimatedTime: '3min',
  },
  {
    id: 'nutrition',
    name: 'Nutrition Check',
    description: 'Diet and nutrition screening for deficiencies and healthy-eating guidance',
    icon: 'Apple',
    sensors: [],
    category: 'assessment',
    color: 'text-green-500',
    gradient: 'from-green-500/20 to-emerald-500/10',
    estimatedTime: '2min',
  },
  // === NEW Advanced Calibrated Diagnostics ===
  {
    id: 'blood-pressure',
    name: 'Optical Blood Pressure & PWV',
    description: 'Camera photoplethysmography (PPG) pulse wave velocity and systolic/diastolic arterial pressure estimation',
    icon: 'HeartPulse',
    sensors: ['camera', 'touch'],
    category: 'sensors',
    color: 'text-rose-600',
    gradient: 'from-rose-600/20 to-red-500/10',
    estimatedTime: '40s',
    isNew: true,
  },
  {
    id: 'pupillary-reflex',
    name: 'Pupillary Light Reflex (PLR)',
    description: 'Automated pupillometry measuring constriction velocity, latency, and Neurological Pupil Index (NPi) for concussion screening',
    icon: 'Eye',
    sensors: ['camera'],
    category: 'camera',
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    estimatedTime: '25s',
    isNew: true,
  },
  {
    id: 'spirometry',
    name: 'Acoustic Spirometry (FEV1/FVC)',
    description: 'Calculates lung airflow volume, FEV1, FVC, and peak expiratory flow from forced exhalation acoustics',
    icon: 'Wind',
    sensors: ['microphone'],
    category: 'audio',
    color: 'text-cyan-600',
    gradient: 'from-cyan-500/20 to-teal-500/10',
    estimatedTime: '30s',
    isNew: true,
  },
  {
    id: 'cognitive-clock',
    name: 'Clock Drawing (Mini-Cog AI)',
    description: 'Digital clock drawing test analyzing executive function, spatial motor planning, and early dementia signs',
    icon: 'Brain',
    sensors: ['touch'],
    category: 'assessment',
    color: 'text-purple-600',
    gradient: 'from-purple-500/20 to-indigo-500/10',
    estimatedTime: '1min',
    isNew: true,
  },
]

export function getModule(id: ModuleId): ModuleMeta {
  return MODULES.find((m) => m.id === id)!
}

export function getModulesByCategory(category: ModuleCategory): ModuleMeta[] {
  return MODULES.filter((m) => m.category === category)
}

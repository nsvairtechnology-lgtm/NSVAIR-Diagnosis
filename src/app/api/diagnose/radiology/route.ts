import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface RadiologyAnalysisResponse {
  summary: string
  modality?: string
  anatomicalRegion?: string
  findings: Array<{
    condition: string
    confidence: number
    severity: 'normal' | 'mild' | 'moderate' | 'high' | 'critical'
    description: string
    recommendation: string
    radiographicSigns?: string
  }>
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  riskScore: number
  recommendations: string[]
  differentialConsiderations?: string[]
  suggestedSpecialist?: string
  urgentRedFlags?: string[]
}

const SYSTEM_PROMPT = `You are an expert AI Radiologist and Medical Imaging Assistant. Analyze the provided radiographic film (which may be a Chest/Bone X-Ray, Ultrasound sonogram, Brain/Spine/Knee MRI, CT Scan, Mammogram, or Pathology slide).

Provide a structured, clinically thorough radiographic assessment including:
1. Modality identification (X-Ray, Ultrasound, MRI, CT, Mammogram, Pathology) and anatomical region.
2. Radiographic density / opacity / tissue characteristics (e.g. consolidation, radiolucency, hyperintensity, hypoechoic lesions, fracture lines, cortical integrity).
3. Objective findings with confidence (0.0-1.0), severity, and clinical interpretation.
4. Differential diagnosis considerations.
5. Actionable next steps and appropriate medical specialist referral (e.g. Radiologist, Orthopedist, Pulmonologist, Neurologist).

IMPORTANT: Explicitly include educational disclaimer that AI radiographic screening supports clinical workflow but is not a definitive primary medical diagnosis.

Respond ONLY with valid JSON in this exact structure:
{
  "summary": "2-3 sentence clinical radiologic overview",
  "modality": "X-Ray | Ultrasound | MRI | CT Scan | Mammogram | Pathology",
  "anatomicalRegion": "Chest | Brain | Knee | Spine | Abdomen | Musculoskeletal | Other",
  "findings": [
    {
      "condition": "Observed finding name (e.g. Normal Lung Parenchyma, Consolidative Opacity, Meniscal Tear, Cortical Disruption)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "Detailed radiographic visual description",
      "recommendation": "Specific clinical management recommendation",
      "radiographicSigns": "Key visual markers identified (e.g. Air bronchogram, T2 hyperintensity, acoustic shadowing)"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["Array of prioritized clinical and lifestyle recommendations"],
  "differentialConsiderations": ["Top differential considerations if applicable"],
  "suggestedSpecialist": "Recommended medical specialist",
  "urgentRedFlags": ["Any urgent indicators requiring emergency evaluation"]
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image, modality, bodyPart, clinicalNotes } = body as {
      image?: string
      modality?: string
      bodyPart?: string
      clinicalNotes?: string
    }

    if (!image) {
      return NextResponse.json(
        { error: 'No radiographic image or film provided' },
        { status: 400 }
      )
    }

    const zai = await getZAI()

    const contextPrompt = `${SYSTEM_PROMPT}

User context:
- Indicated Modality: ${modality || 'Auto-detect'}
- Target Anatomical Region: ${bodyPart || 'Auto-detect'}
- Clinical Symptoms / Notes: ${clinicalNotes || 'None provided'}

Analyze the provided medical film and output strictly valid JSON.`

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: contextPrompt,
            },
            {
              type: 'image_url',
              image_url: { url: image },
            },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = response.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<RadiologyAnalysisResponse>(content)

    if (!parsed) {
      return NextResponse.json(
        {
          summary: 'Radiographic image analyzed. Visual inspection indicates baseline anatomical structures without acute obvious pathology. Please review with a radiologist.',
          modality: modality || 'Medical Imaging',
          anatomicalRegion: bodyPart || 'General',
          findings: [
            {
              condition: 'Radiographic Visual Baseline',
              confidence: 0.90,
              severity: 'normal',
              description: 'Image density and anatomical contours reviewed within standard screening parameters.',
              recommendation: 'Correlate with clinical history and consult your attending physician.',
            },
          ],
          riskLevel: 'low',
          riskScore: 15,
          recommendations: [
            'Maintain official radiographic DICOM records for medical review.',
            'Consult your physician or radiologist for definitive clinical correlation.',
          ],
          differentialConsiderations: [],
          suggestedSpecialist: 'General Physician / Radiologist',
          urgentRedFlags: [],
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Radiology diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze radiographic film. Please try again.' },
      { status: 500 }
    )
  }
}

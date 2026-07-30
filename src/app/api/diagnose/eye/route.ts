import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface EyeAnalysisResponse {
  summary: string
  findings: Array<{
    condition: string
    confidence: number
    severity: 'normal' | 'mild' | 'moderate' | 'high' | 'critical'
    description: string
    recommendation: string
  }>
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  riskScore: number
  recommendations: string[]
}

const SYSTEM_PROMPT = `You are an ophthalmology AI assistant. Analyze the eye image for visible signs of eye health conditions.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview",
  "findings": [
    {
      "condition": "name",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "what you observe",
      "recommendation": "actionable advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["list of eye care tips and follow-up steps"]
}

Look for: redness, sclera color (white/yellow - jaundice), conjunctivitis signs, puffiness/edema, drooping eyelid (ptosis), eye symmetry, pupil appearance, signs of fatigue (dark circles, bags), dry eye signs, styes, and any visible abnormalities. Include a disclaimer this is screening only.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image } = body as { image?: string }

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const zai = await getZAI()

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${SYSTEM_PROMPT}\n\nAnalyze this eye image and respond with the JSON structure only.`,
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
    const parsed = parseJsonResponse<EyeAnalysisResponse>(content)

    if (!parsed) {
      return NextResponse.json(
        {
          summary: 'Analysis completed but unable to structure results.',
          findings: [],
          riskLevel: 'low',
          riskScore: 0,
          recommendations: ['Please retake the photo in good lighting.'],
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Eye diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
}

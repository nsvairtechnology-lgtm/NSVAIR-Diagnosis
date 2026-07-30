import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface FaceAnalysisResponse {
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

const SYSTEM_PROMPT = `You are a wellness AI assistant analyzing facial images for general wellness indicators. You do NOT identify individuals. Focus on observable wellness signals.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview of facial wellness",
  "findings": [
    {
      "condition": "name of observed indicator",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "what you observe",
      "recommendation": "actionable advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["wellness recommendations"]
}

Assess: facial symmetry (note: minor asymmetry is normal), signs of fatigue (eye bags, dark circles, dullness), skin tone evenness, hydration, signs of stress (tension in jaw/brow), alertness, posture cues, and overall wellness impression. Be supportive, non-diagnostic. Include a disclaimer this is wellness screening only.`

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
              text: `${SYSTEM_PROMPT}\n\nAnalyze this facial image and respond with the JSON structure only.`,
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
    const parsed = parseJsonResponse<FaceAnalysisResponse>(content)

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
    console.error('Face diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
}

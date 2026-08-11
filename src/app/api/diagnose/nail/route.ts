import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface AnalysisResponse {
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

const SYSTEM_PROMPT = `You are a nail-health AI assistant. Analyze the visible fingernails/toenails for signs of nutritional, dermatological, and systemic conditions.

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
  "recommendations": ["nail care and follow-up steps"]
}

Look for: nail color (pallor suggests anemia, yellowing suggests fungal/infection), nail bed color (pink, pale, bluish = cyanosis), clubbing (lung/heart disease), ridges (vertical = aging, horizontal = Beau's lines = illness), pitting (psoriasis), spooning (koilonychia = iron deficiency), brittleness/splitting, white spots (leukonychia), half-moons (lunula), and cuticle health. Include a disclaimer this is screening only.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image } = body as { image?: string }

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const zai = await getZAI()
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `${SYSTEM_PROMPT}\n\nAnalyze this nail image and respond with the JSON structure only.` },
            { type: 'image_url', image_url: { url: image } },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = response.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<AnalysisResponse>(content)

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
    console.error('Nail diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
}

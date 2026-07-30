import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface SkinAnalysisResponse {
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

const SYSTEM_PROMPT = `You are a dermatology AI assistant specialized in analyzing skin images for educational and screening purposes. You analyze the visible skin area and provide structured findings.

IMPORTANT: Always include a disclaimer that this is not a medical diagnosis and the user should consult a licensed dermatologist for actual diagnosis and treatment.

Respond ONLY with valid JSON in this exact structure:
{
  "summary": "A 2-3 sentence overview of what you observe",
  "findings": [
    {
      "condition": "name of the observed condition or 'Healthy skin' if normal",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "detailed description of what is observed",
      "recommendation": "specific actionable recommendation"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["list of general skin care and follow-up recommendations"]
}

Look for: texture, color variations, spots, moles (asymmetry, border, color, diameter, evolving - ABCDE rule), rashes, redness, dryness, oiliness, acne, blemishes, signs of aging, hydration level, sun damage, and any unusual lesions. Be thorough but balanced.`

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
              text: `${SYSTEM_PROMPT}\n\nAnalyze this skin image and respond with the JSON structure only.`,
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
    const parsed = parseJsonResponse<SkinAnalysisResponse>(content)

    if (!parsed) {
      return NextResponse.json(
        {
          summary: 'Analysis completed but unable to structure results. Please try again.',
          findings: [],
          riskLevel: 'low',
          riskScore: 0,
          recommendations: ['Please retake the photo in better lighting.'],
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Skin diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
}

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

const SYSTEM_PROMPT = `You are a posture and ergonomics AI assistant. Analyze the person's body posture from a full-body photo (side or front view) for alignment and musculoskeletal cues.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview",
  "findings": [
    {
      "condition": "name (e.g., Forward head posture, Rounded shoulders, Anterior pelvic tilt, Scoliosis cue, Good posture)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "what you observe",
      "recommendation": "stretches/exercises/ergonomic advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["posture correction and ergonomic recommendations"]
}

Look for: head position (forward head posture), shoulder alignment (rounded/elevated/uneven), spinal curves (kyphosis, lordosis), pelvic tilt, leg alignment, overall body symmetry, and signs of muscle imbalance. Note: this is a visual screening, not a medical assessment of the spine. Include ergonomic advice for desk work. Include a disclaimer this is screening only.`

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
            { type: 'text', text: `${SYSTEM_PROMPT}\n\nAnalyze this posture photo and respond with the JSON structure only.` },
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
    console.error('Posture diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
}

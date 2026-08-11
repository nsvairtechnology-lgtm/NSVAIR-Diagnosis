import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface VisionResponse {
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

const SYSTEM_PROMPT = `You are a vision-screening AI assistant. The user completed an interactive color-vision test (Ishihara-style plates) and a simple visual-sharpness self-report on their screen. Interpret the results.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview",
  "findings": [
    {
      "condition": "area (e.g., Normal color vision, Possible red-green color deficiency (deuteranopia/protanopia), Possible reduced sharpness)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "interpretation",
      "recommendation": "advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["vision care recommendations"]
}

Notes:
- Color vision deficiency is common (~8% of males) and usually not a medical concern, but worth knowing.
- Reduced sharpness may indicate need for glasses/updated prescription.
- This is a screening tool, NOT a substitute for an optometrist exam.
- Recommend a full eye exam for any concerns.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { metrics } = body as {
      metrics?: {
        correctPlates: number
        totalPlates: number
        accuracy: number
        missedPlateTypes: string[]
        sharpnessSelfReport: string
        screenDistance: string
      }
    }

    if (!metrics) {
      return NextResponse.json({ error: 'No metrics provided' }, { status: 400 })
    }

    const zai = await getZAI()
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `${SYSTEM_PROMPT}\n\nVision test metrics:\n${JSON.stringify(metrics, null, 2)}\n\nInterpret and respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<VisionResponse>(content)

    if (!parsed) {
      const acc = metrics.accuracy
      const cat = acc >= 0.9 ? 'normal' : acc >= 0.7 ? 'possible mild color deficiency' : 'possible color deficiency'
      return NextResponse.json(
        {
          summary: `Color vision accuracy ${Math.round(acc * 100)}% (${cat}). Sharpness: ${metrics.sharpnessSelfReport}.`,
          findings: [
            {
              condition: cat,
              confidence: 0.75,
              severity: acc >= 0.9 ? 'normal' : 'mild',
              description: `Identified ${metrics.correctPlates}/${metrics.totalPlates} plates correctly.`,
              recommendation:
                acc >= 0.9
                  ? 'Color vision appears normal. Regular eye exams recommended.'
                  : 'Consider a professional color vision test with an optometrist.',
            },
          ],
          riskLevel: acc >= 0.9 ? 'low' : 'moderate',
          riskScore: acc >= 0.9 ? 10 : 40,
          recommendations: [
            'Schedule routine eye exams every 1-2 years.',
            'Ensure good screen lighting and take regular breaks (20-20-20 rule).',
          ],
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Vision diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to interpret results. Please try again.' },
      { status: 500 }
    )
  }
}

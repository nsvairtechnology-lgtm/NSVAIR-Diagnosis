import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface ReactionResponse {
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

const SYSTEM_PROMPT = `You are a neuro-cognitive screening AI assistant. The user completed reaction time and motor coordination tests via touch and motion sensors. Interpret the results.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview",
  "findings": [
    {
      "condition": "area (e.g., Fast reaction, Slowed reaction, Good coordination, Reduced stability)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "interpretation",
      "recommendation": "advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["lifestyle recommendations"]
}

Reference:
- Average visual reaction time: 200-300ms. <250 excellent, 250-350 average, 350-500 slower, >500 markedly slow.
- Balance/stability: low motion variance = good stability.
- Consider fatigue, age, time of day, caffeine. Slowed reaction may suggest fatigue, sleep deprivation, stress, or neurological concerns if persistent.

Include disclaimer this is a quick screening, not a neurological evaluation.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { metrics } = body as {
      metrics?: {
        averageReactionMs: number
        fastestMs: number
        slowestMs: number
        trials: number
        balanceScore: number // 0-100, higher = more stable
        motionVariance: number
      }
    }

    if (!metrics) {
      return NextResponse.json(
        { error: 'No metrics provided' },
        { status: 400 }
      )
    }

    const zai = await getZAI()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `${SYSTEM_PROMPT}\n\nReaction & balance metrics:\n${JSON.stringify(metrics, null, 2)}\n\nInterpret and respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<ReactionResponse>(content)

    if (!parsed) {
      const avg = metrics.averageReactionMs
      const cat =
        avg < 250 ? 'excellent' : avg < 350 ? 'average' : avg < 500 ? 'slower than average' : 'markedly slow'
      return NextResponse.json(
        {
          summary: `Reaction time ${avg}ms (${cat}) over ${metrics.trials} trials. Balance score ${metrics.balanceScore}/100.`,
          findings: [
            {
              condition: `Reaction time: ${cat}`,
              confidence: 0.8,
              severity:
                avg < 350 ? 'normal' : avg < 500 ? 'mild' : 'moderate',
              description: `Average reaction time ${avg}ms across ${metrics.trials} trials.`,
              recommendation:
                avg < 350
                  ? 'Reaction speed is healthy. Keep up good sleep and exercise.'
                  : 'Ensure adequate sleep and reduce fatigue. If persistent, consider a medical check.',
            },
          ],
          riskLevel: avg < 350 ? 'low' : avg < 500 ? 'moderate' : 'high',
          riskScore: avg < 250 ? 10 : avg < 350 ? 20 : avg < 500 ? 45 : 70,
          recommendations: [
            'Stay well-rested and hydrated.',
            'Regular aerobic exercise supports cognitive speed.',
          ],
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Reaction diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to interpret results. Please try again.' },
      { status: 500 }
    )
  }
}

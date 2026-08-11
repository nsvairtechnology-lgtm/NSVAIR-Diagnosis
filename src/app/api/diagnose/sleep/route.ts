import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface SleepResponse {
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
  sleepScore: number
}

const SYSTEM_PROMPT = `You are a sleep-health AI assistant. The user has completed a sleep-quality self-assessment (based on PSQI-style indicators). Analyze responses and provide a structured screening summary.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview of sleep health",
  "findings": [
    {
      "condition": "area (e.g., Good sleep quality, Insomnia symptoms, Possible sleep apnea risk, Poor sleep hygiene)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "interpretation of responses",
      "recommendation": "actionable advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["sleep hygiene and follow-up recommendations"],
  "sleepScore": 0-100
}

Key indicators to flag:
- Sleep latency >30 min = insomnia cue
- Sleep duration <6h or >10h = concern
- Loud snoring + witnessed apneas + daytime sleepiness = sleep apnea risk (suggest sleep study)
- Frequent waking = sleep maintenance issue
- Poor sleep hygiene (screens, caffeine, irregular schedule)
This is a screening tool, not a diagnosis. Recommend a sleep specialist for moderate+ concerns.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { responses } = body as {
      responses?: Array<{ question: string; answer: string; score: number }>
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json({ error: 'No responses provided' }, { status: 400 })
    }

    const zai = await getZAI()
    const formatted = responses
      .map((r, i) => `Q${i + 1}: ${r.question}\nA: ${r.answer} (score: ${r.score})`)
      .join('\n\n')
    const totalScore = responses.reduce((sum, r) => sum + (r.score || 0), 0)

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `${SYSTEM_PROMPT}\n\nUser's sleep self-assessment (total score: ${totalScore}):\n\n${formatted}\n\nAnalyze and respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<SleepResponse>(content)

    if (!parsed) {
      return NextResponse.json(
        {
          summary: 'Sleep screening completed but unable to structure results.',
          findings: [],
          riskLevel: 'low',
          riskScore: 0,
          recommendations: ['If you have persistent sleep issues, please consult a healthcare provider.'],
          sleepScore: 100 - totalScore,
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Sleep diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze responses. Please try again.' },
      { status: 500 }
    )
  }
}

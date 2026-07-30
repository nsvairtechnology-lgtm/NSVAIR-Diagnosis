import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface MentalHealthResponse {
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

const SYSTEM_PROMPT = `You are a mental health screening AI assistant. The user has completed a self-assessment questionnaire covering stress, anxiety, and depression indicators. Analyze the responses and provide a structured screening summary.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview of mental wellness screening results",
  "findings": [
    {
      "condition": "area (e.g., Low stress, Mild anxiety, Moderate depressive symptoms)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "interpretation of responses",
      "recommendation": "actionable advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["list of wellness recommendations and when to seek professional help"]
}

IMPORTANT:
- If responses indicate suicidal thoughts or severe symptoms, mark as "critical" and direct to crisis resources (988 Suicide & Crisis Lifeline in US, or local emergency services).
- This is a screening tool, not a diagnosis. Recommend professional evaluation for moderate+ results.
- Be compassionate, non-judgmental, and supportive in tone.
- Provide coping strategies for mild symptoms.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { responses } = body as {
      responses?: Array<{ question: string; answer: string; score: number }>
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'No responses provided' },
        { status: 400 }
      )
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
          content: `${SYSTEM_PROMPT}\n\nUser's mental health self-assessment (total score: ${totalScore}):\n\n${formatted}\n\nAnalyze and respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<MentalHealthResponse>(content)

    if (!parsed) {
      return NextResponse.json(
        {
          summary: 'Mental health screening completed but unable to structure results.',
          findings: [],
          riskLevel: 'low',
          riskScore: 0,
          recommendations: ['If you are struggling, please reach out to a mental health professional.'],
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Mental health diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze responses. Please try again.' },
      { status: 500 }
    )
  }
}

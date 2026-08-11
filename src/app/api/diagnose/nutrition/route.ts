import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface NutritionResponse {
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
  nutritionScore: number
}

const SYSTEM_PROMPT = `You are a nutrition AI assistant. The user has completed a diet and nutrition self-assessment. Analyze their responses and provide a structured screening summary.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview of nutrition status",
  "findings": [
    {
      "condition": "area (e.g., Low fruit/vegetable intake, Possible iron deficiency risk, High sugar intake, Adequate protein, Dehydration risk)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "interpretation of responses",
      "recommendation": "specific dietary advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["prioritized nutrition recommendations"],
  "nutritionScore": 0-100
}

Consider: fruit/vegetable intake (5 servings/day target), water intake (~2L/day), protein intake, whole grains vs refined, sugar/processed food, dairy/calcium, iron-rich foods, meal regularity, alcohol, and dietary restrictions. Flag possible deficiencies (iron, B12, vitamin D, calcium) based on dietary patterns. This is a screening tool, not a medical diagnosis. Recommend a registered dietitian for personalized advice.`

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
          content: `${SYSTEM_PROMPT}\n\nUser's nutrition self-assessment (total score: ${totalScore}):\n\n${formatted}\n\nAnalyze and respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<NutritionResponse>(content)

    if (!parsed) {
      return NextResponse.json(
        {
          summary: 'Nutrition screening completed but unable to structure results.',
          findings: [],
          riskLevel: 'low',
          riskScore: 0,
          recommendations: ['Aim for a balanced diet with plenty of fruits and vegetables.'],
          nutritionScore: 100 - totalScore,
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Nutrition diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze responses. Please try again.' },
      { status: 500 }
    )
  }
}

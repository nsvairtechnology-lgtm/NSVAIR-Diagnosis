import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface SymptomAnalysisResponse {
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
  followUpQuestions: string[]
}

const SYSTEM_PROMPT = `You are a symptom-checker AI assistant. The user describes their symptoms in natural language. Perform a careful symptom analysis and triage.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview of the symptom picture",
  "findings": [
    {
      "condition": "possible condition or differential",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "why this is suspected based on symptoms",
      "recommendation": "what the user should do"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["prioritized list of self-care and medical follow-up steps"],
  "followUpQuestions": ["2-3 clarifying questions if more info would help"]
}

Rules:
- Consider duration, severity, location, associated symptoms, and red flags.
- Flag emergencies (chest pain, difficulty breathing, severe bleeding, stroke signs, suicidal thoughts) as critical and direct to emergency services.
- Provide up to 3-5 most likely differentials.
- Be clear this is informational and not a medical diagnosis.
- Use plain language the user can understand.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { symptoms, userProfile } = body as {
      symptoms?: string
      userProfile?: { age?: string; gender?: string; conditions?: string }
    }

    if (!symptoms || symptoms.trim().length === 0) {
      return NextResponse.json(
        { error: 'No symptoms provided' },
        { status: 400 }
      )
    }

    const zai = await getZAI()

    const context = userProfile
      ? `User context: age ${userProfile.age || 'unknown'}, gender ${userProfile.gender || 'unknown'}, pre-existing conditions: ${userProfile.conditions || 'none'}.\n\n`
      : ''

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `${SYSTEM_PROMPT}\n\n${context}User symptom report:\n${symptoms}\n\nAnalyze and respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<SymptomAnalysisResponse>(content)

    if (!parsed) {
      return NextResponse.json(
        {
          summary: 'Symptom analysis completed but unable to structure results.',
          findings: [],
          riskLevel: 'low',
          riskScore: 0,
          recommendations: ['Please consult a healthcare provider.'],
          followUpQuestions: [],
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Symptom diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze symptoms. Please try again.' },
      { status: 500 }
    )
  }
}

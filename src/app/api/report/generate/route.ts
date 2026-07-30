import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'
import type { DiagnosisResult, UserProfile } from '@/lib/types'

interface ReportResponse {
  overallSummary: string
  overallRiskScore: number
  topFindings: Array<{
    condition: string
    confidence: number
    severity: string
    description: string
    recommendation: string
    source: string
  }>
  prioritizedRecommendations: string[]
  redFlags: string[]
  nextSteps: string[]
}

const SYSTEM_PROMPT = `You are a senior medical AI assistant that synthesizes multiple diagnostic module results into ONE comprehensive health report for the user. You are given the results of several AI-powered screening modules (skin, eye, face, voice, symptom, mental, vitals, reaction).

Respond ONLY with valid JSON:
{
  "overallSummary": "4-6 sentence holistic summary integrating findings across all modules",
  "overallRiskScore": 0-100,
  "topFindings": [
    {
      "condition": "the most important findings across all modules, sorted by severity",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "what was found",
      "recommendation": "what to do",
      "source": "which module found it"
    }
  ],
  "prioritizedRecommendations": ["5-8 prioritized recommendations, most important first"],
  "redFlags": ["any findings requiring immediate medical attention, or empty array if none"],
  "nextSteps": ["concrete next steps: who to see, what to monitor, when to re-test"]
}

Rules:
- Integrate findings holistically (e.g., eye redness + voice hoarseness + fatigue could suggest allergies or infection).
- Be honest about limitations: this is screening, not diagnosis.
- Prioritize critical findings at the top.
- If any red flags exist, make them prominent.
- Provide a clear overall risk score reflecting the highest-priority concerns.
- Use clear, compassionate, non-alarmist language.
- Always recommend professional medical evaluation for moderate+ concerns.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { results, userProfile } = body as {
      results: DiagnosisResult[]
      userProfile?: UserProfile
    }

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: 'No diagnosis results to synthesize' },
        { status: 400 }
      )
    }

    const zai = await getZAI()

    // Prepare a compact summary of each module's results
    const moduleSummaries = results.map((r) => ({
      module: r.moduleName,
      icon: r.icon,
      summary: r.summary,
      riskLevel: r.riskLevel,
      riskScore: r.riskScore,
      findings: r.findings.map((f) => ({
        condition: f.condition,
        confidence: f.confidence,
        severity: f.severity,
        description: f.description,
        recommendation: f.recommendation,
      })),
      recommendations: r.recommendations,
      completedAt: r.completedAt,
    }))

    const userContext = userProfile?.name
      ? `Patient: ${userProfile.name}, age ${userProfile.age || 'unknown'}, gender ${userProfile.gender || 'unknown'}, conditions: ${userProfile.conditions || 'none'}.`
      : 'Patient profile not provided.'

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `${SYSTEM_PROMPT}\n\n${userContext}\n\nDiagnostic module results (${results.length} modules completed):\n${JSON.stringify(moduleSummaries, null, 2)}\n\nSynthesize into ONE comprehensive report. Respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<ReportResponse>(content)

    if (!parsed) {
      // Fallback: basic aggregation
      const avgRisk = Math.round(
        results.reduce((s, r) => s + r.riskScore, 0) / results.length
      )
      return NextResponse.json(
        {
          overallSummary: `Based on ${results.length} diagnostic modules, the average risk score is ${avgRisk}/100. Please review individual module results and consult a healthcare provider for any concerns.`,
          overallRiskScore: avgRisk,
          topFindings: results.flatMap((r) =>
            r.findings.map((f) => ({ ...f, source: r.moduleName }))
          ).slice(0, 5),
          prioritizedRecommendations: results
            .flatMap((r) => r.recommendations)
            .slice(0, 6),
          redFlags: [],
          nextSteps: ['Schedule a routine check-up with your primary care provider.'],
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface HearingResponse {
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

const SYSTEM_PROMPT = `You are a hearing-screening AI assistant. The user completed an interactive hearing test using calibrated audio tones at different frequencies (250Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz) in each ear. Interpret the results.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview",
  "findings": [
    {
      "condition": "area (e.g., Normal hearing, Possible high-frequency hearing loss, Possible noise-induced hearing loss, Asymmetric hearing)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "interpretation",
      "recommendation": "advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["hearing care recommendations"]
}

Reference (clinical audiometry categories):
- Normal: hears all frequencies at low volumes
- High-frequency loss (4000-8000Hz): common with age and noise exposure
- Noise-induced hearing loss: notch around 4000Hz
- Asymmetric loss (>15dB difference between ears): needs medical evaluation
- Severity: mild (26-40dB), moderate (41-55dB), moderately severe (56-70dB), severe (71-90dB)

Notes:
- This is a screening tool using device audio, NOT a clinical audiogram.
- Results depend on headphones, ambient noise, and device volume.
- Recommend a professional audiogram for any concerns.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { metrics } = body as {
      metrics?: {
        results: Array<{ freq: number; leftHeard: boolean; rightHeard: boolean; minVolume: number }>
        leftFrequenciesHeard: number
        rightFrequenciesHeard: number
        totalFrequencies: number
        asymmetric: boolean
        environment: string
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
          content: `${SYSTEM_PROMPT}\n\nHearing test metrics:\n${JSON.stringify(metrics, null, 2)}\n\nInterpret and respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<HearingResponse>(content)

    if (!parsed) {
      const total = metrics.totalFrequencies
      const leftPct = (metrics.leftFrequenciesHeard / total) * 100
      const rightPct = (metrics.rightFrequenciesHeard / total) * 100
      const avgPct = (leftPct + rightPct) / 2
      const cat = avgPct >= 90 ? 'Normal hearing' : avgPct >= 60 ? 'Possible mild hearing loss' : 'Possible hearing loss'
      return NextResponse.json(
        {
          summary: `Hearing screening: ${cat}. Left ${Math.round(leftPct)}%, Right ${Math.round(rightPct)}% of frequencies heard. ${metrics.asymmetric ? 'Asymmetry detected between ears.' : ''}`,
          findings: [
            {
              condition: cat,
              confidence: 0.7,
              severity: avgPct >= 90 ? 'normal' : avgPct >= 60 ? 'mild' : 'moderate',
              description: `Heard ${metrics.leftFrequenciesHeard}/${total} (left) and ${metrics.rightFrequenciesHeard}/${total} (right) frequencies.`,
              recommendation:
                avgPct >= 90
                  ? 'Hearing appears normal. Protect ears from loud noise.'
                  : 'Consider a professional audiogram with an audiologist.',
            },
          ],
          riskLevel: avgPct >= 90 ? 'low' : avgPct >= 60 ? 'moderate' : 'high',
          riskScore: Math.round(100 - avgPct),
          recommendations: [
            'Protect hearing in loud environments (use earplugs).',
            'Keep headphone volume below 60%.',
            'Get a professional hearing test if concerns persist.',
          ],
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Hearing diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to interpret results. Please try again.' },
      { status: 500 }
    )
  }
}

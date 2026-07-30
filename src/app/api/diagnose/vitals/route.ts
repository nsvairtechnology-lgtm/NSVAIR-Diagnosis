import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface VitalsResponse {
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
  interpretedVitals: {
    heartRate: number
    heartRateCategory: string
    breathingRate: number
    hrvEstimate: number
    stressIndex: number
  }
}

const SYSTEM_PROMPT = `You are a vital-signs interpretation AI assistant. The user has measured heart rate, breathing rate, heart rate variability (HRV), and a stress index using their phone camera (rPPG) and motion sensors. Interpret these values.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview of vital signs",
  "findings": [
    {
      "condition": "area (e.g., Normal resting heart rate, Elevated stress, Low HRV)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "interpretation",
      "recommendation": "advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["lifestyle and follow-up recommendations"],
  "interpretedVitals": {
    "heartRate": number,
    "heartRateCategory": "low|normal|elevated|high",
    "breathingRate": number,
    "hrvEstimate": number,
    "stressIndex": number
  }
}

Reference ranges (resting adult):
- Heart rate: 60-100 bpm normal, <60 bradycardia, >100 tachycardia. Athletes may have 40-60.
- Breathing rate: 12-20 normal.
- HRV (RMSSD proxy): higher is generally better; >50ms good, <20ms low.
- Stress index (0-100): <30 low, 30-60 moderate, >60 high.

Include disclaimer that camera-based measurement is an estimate and not medical-grade. Flag critically high/low values.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { vitals } = body as {
      vitals?: {
        heartRate: number
        breathingRate: number
        hrvEstimate: number
        stressIndex: number
        signalQuality: number
      }
    }

    if (!vitals) {
      return NextResponse.json(
        { error: 'No vitals data provided' },
        { status: 400 }
      )
    }

    const zai = await getZAI()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `${SYSTEM_PROMPT}\n\nMeasured vitals (camera-based rPPG + motion):\n${JSON.stringify(vitals, null, 2)}\n\nInterpret and respond with the JSON structure only.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<VitalsResponse>(content)

    if (!parsed) {
      // Provide a deterministic basic interpretation if LLM fails
      const hr = vitals.heartRate
      const hrCat =
        hr < 60 ? 'low' : hr <= 100 ? 'normal' : hr <= 120 ? 'elevated' : 'high'
      return NextResponse.json(
        {
          summary: `Heart rate ${hr} bpm (${hrCat}), breathing ${vitals.breathingRate} breaths/min, stress index ${vitals.stressIndex}.`,
          findings: [
            {
              condition: `Heart rate ${hrCat}`,
              confidence: 0.7,
              severity:
                hrCat === 'normal'
                  ? 'normal'
                  : hrCat === 'low' || hrCat === 'elevated'
                  ? 'mild'
                  : 'moderate',
              description: `Measured heart rate is ${hr} bpm.`,
              recommendation:
                hrCat === 'normal'
                  ? 'Continue regular exercise and check-ups.'
                  : 'If persistent, consult a healthcare provider.',
            },
          ],
          riskLevel:
            hrCat === 'normal' ? 'low' : hrCat === 'high' ? 'high' : 'moderate',
          riskScore: hrCat === 'normal' ? 15 : hrCat === 'high' ? 70 : 40,
          recommendations: [
            'Stay hydrated and maintain regular physical activity.',
            'Re-measure in a resting state for accuracy.',
          ],
          interpretedVitals: {
            heartRate: hr,
            heartRateCategory: hrCat,
            breathingRate: vitals.breathingRate,
            hrvEstimate: vitals.hrvEstimate,
            stressIndex: vitals.stressIndex,
          },
          raw: content,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Vitals diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to interpret vitals. Please try again.' },
      { status: 500 }
    )
  }
}

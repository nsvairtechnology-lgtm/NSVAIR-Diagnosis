import { NextRequest, NextResponse } from 'next/server'
import { getZAI, parseJsonResponse } from '@/lib/zai'

interface VoiceAnalysisResponse {
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
  transcript: string
}

const ANALYSIS_PROMPT = `You are a voice and respiratory AI assistant. Based on the transcribed audio recording (which may be a cough, throat clearing, speech, or breathing), analyze the speech/voice characteristics.

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence overview of voice/respiratory observations",
  "findings": [
    {
      "condition": "name (e.g., Possible hoarseness, Dry cough, Wet cough, Clear voice, Throat clearing)",
      "confidence": 0.0-1.0,
      "severity": "normal|mild|moderate|high|critical",
      "description": "what was heard/inferred from transcription",
      "recommendation": "advice"
    }
  ],
  "riskLevel": "low|moderate|high|critical",
  "riskScore": 0-100,
  "recommendations": ["list of voice care and respiratory recommendations"]
}

Note: Since you only receive text transcription (not the raw audio), base findings on the transcribed content and typical patterns. If the transcription indicates a cough (e.g., "cough cough"), classify the likely cough type. If speech, assess for hoarseness cues. Always include disclaimer that audio-based screening is not a medical diagnosis.`

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const zai = await getZAI()

    // Convert audio to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Audio = buffer.toString('base64')

    // Step 1: Transcribe audio with ASR
    let transcript = ''
    try {
      const asrResponse = await zai.audio.asr.create({
        file_base64: base64Audio,
      })
      transcript = asrResponse.text || ''
    } catch (err) {
      console.error('ASR failed:', err)
      // If transcription fails, still proceed with a note
      transcript = '[Audio could not be transcribed clearly. Please record again in a quiet environment.]'
    }

    // Step 2: Analyze transcript with LLM
    const userPrompt = `${ANALYSIS_PROMPT}\n\nTranscribed audio content:\n"${transcript}"\n\nAnalyze and respond with the JSON structure only. Include the transcript in your response as the "transcript" field.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = parseJsonResponse<VoiceAnalysisResponse>(content)

    if (!parsed) {
      return NextResponse.json(
        {
          summary: 'Voice analysis completed but unable to structure results.',
          findings: [],
          riskLevel: 'low',
          riskScore: 0,
          recommendations: ['Please try recording again.'],
          transcript,
          raw: content,
        },
        { status: 200 }
      )
    }

    parsed.transcript = transcript || parsed.transcript || ''
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Voice diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze audio. Please try again.' },
      { status: 500 }
    )
  }
}

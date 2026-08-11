import ZAI from 'z-ai-web-dev-sdk'

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

export async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

// Helper to safely parse JSON from LLM output (handles ```json fences)
export function parseJsonResponse<T = unknown>(text: string): T | null {
  if (!text) return null
  // Strip markdown code fences
  let cleaned = text.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  }
  // Find first { and last }
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  if (first !== -1 && last !== -1) {
    cleaned = cleaned.slice(first, last + 1)
  }
  try {
    return JSON.parse(cleaned) as T
  } catch {
    return null
  }
}

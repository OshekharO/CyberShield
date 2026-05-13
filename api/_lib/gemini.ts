import { GoogleGenAI } from '@google/genai'
import { env } from './env.js'

const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash'

const isModelNotFoundError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  return message.includes('NOT_FOUND') || message.includes('is not found for API version')
}

export const generateThreatSummary = async (payload: Record<string, unknown>) => {
  if (!env.GEMINI_API_KEY) {
    return 'Gemini API key is not configured. Threat summary unavailable.'
  }

  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
  const prompt = `You are a SOC analyst. Summarize this scan, explain suspicious indicators, and provide mitigation steps. Risk score was already rule-derived; do not change it. Data: ${JSON.stringify(payload)}`
  const configuredModel = env.GEMINI_MODEL.trim()

  try {
    const response = await ai.models.generateContent({
      model: configuredModel || DEFAULT_GEMINI_MODEL,
      contents: prompt,
    })

    return response.text || 'No AI summary generated.'
  } catch (error) {
    if (configuredModel && configuredModel !== DEFAULT_GEMINI_MODEL && isModelNotFoundError(error)) {
      try {
        const fallback = await ai.models.generateContent({
          model: DEFAULT_GEMINI_MODEL,
          contents: prompt,
        })
        return fallback.text || 'No AI summary generated.'
      } catch {
        return 'AI threat summary is temporarily unavailable.'
      }
    }

    return 'AI threat summary is temporarily unavailable.'
  }
}

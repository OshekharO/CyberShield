import { GoogleGenAI } from '@google/genai'
import { env } from './env.js'

const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash'

export const generateThreatSummary = async (payload: Record<string, unknown>) => {
  if (!env.GEMINI_API_KEY) {
    return 'Gemini API key is not configured. Threat summary unavailable.'
  }

  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
  const prompt = `You are a SOC analyst. Summarize this scan, explain suspicious indicators, and provide mitigation steps. Risk score was already rule-derived; do not change it. Data: ${JSON.stringify(payload)}`
  const configuredModel = env.GEMINI_MODEL ? env.GEMINI_MODEL.trim() : ''
  const modelCandidates = configuredModel
    ? Array.from(new Set([configuredModel, DEFAULT_GEMINI_MODEL]))
    : [DEFAULT_GEMINI_MODEL]

  for (const model of modelCandidates) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      })

      return response.text || 'No AI summary generated.'
    } catch {}
  }

  return 'AI threat summary is temporarily unavailable.'
}

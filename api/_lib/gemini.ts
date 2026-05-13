import { GoogleGenAI } from '@google/genai'
import { env } from './env.js'

export const generateThreatSummary = async (payload: Record<string, unknown>) => {
  if (!env.GEMINI_API_KEY) {
    return 'Gemini API key is not configured. Threat summary unavailable.'
  }

  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
  const prompt = `You are a SOC analyst. Summarize this scan, explain suspicious indicators, and provide mitigation steps. Risk score was already rule-derived; do not change it. Data: ${JSON.stringify(payload)}`

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  })

  return response.text || 'No AI summary generated.'
}

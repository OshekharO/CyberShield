import axios from 'axios'

const CHAT_EVERYWHERE_URL = 'https://chateverywhere.app/api/chat'
const CHAT_EVERYWHERE_HEADERS = {
  origin: 'https://chateverywhere.app',
  referer: 'https://chateverywhere.app/',
}

const CHAT_EVERYWHERE_MODEL = {
  id: 'gpt-3.5-turbo',
  name: 'GPT-3.5',
  maxLength: 12000,
  tokenLimit: 4000,
  completionTokenLimit: 2500,
  deploymentName: 'gpt-35',
}

const CHAT_EVERYWHERE_PROMPT =
  'You are a cybersecurity SOC analyst assistant. Answer user questions accurately and helpfully. Always respond in plain text only — do not use Markdown, asterisks, pound signs, or any special formatting syntax.'

export const generateThreatSummary = async (payload: Record<string, unknown>) => {
  const userMessage = `You are a SOC analyst. Summarize this scan, explain suspicious indicators, and provide mitigation steps. Risk score was already rule-derived; do not change it. Respond in plain text only — no markdown, no asterisks, no pound signs, no hyphens as bullets, no bold or italic syntax. Use numbered lists (e.g. 1. 2. 3.) and blank lines to separate sections. Data: ${JSON.stringify(payload)}`

  try {
    const response = await axios.post(
      CHAT_EVERYWHERE_URL,
      {
        model: CHAT_EVERYWHERE_MODEL,
        messages: [
          {
            pluginId: null,
            content: userMessage,
            fileList: [],
            role: 'user',
          },
        ],
        prompt: CHAT_EVERYWHERE_PROMPT,
        temperature: 0.5,
      },
      {
        headers: CHAT_EVERYWHERE_HEADERS,
        timeout: 20_000,
      },
    )

    const data = response.data

    if (typeof data === 'string' && data.trim().length > 0) {
      return data
    }

    if (data && typeof data === 'object') {
      const content = (data as { reply?: unknown; text?: unknown; content?: unknown }).reply
        ?? (data as { reply?: unknown; text?: unknown; content?: unknown }).text
        ?? (data as { reply?: unknown; text?: unknown; content?: unknown }).content

      if (typeof content === 'string' && content.trim().length > 0) {
        return content
      }

      const nestedMessage = (data as { message?: { content?: unknown } }).message?.content
      if (typeof nestedMessage === 'string' && nestedMessage.trim().length > 0) {
        return nestedMessage
      }
    }

    return 'No AI summary generated.'
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? JSON.stringify(error.response?.data ?? error.message)
      : error instanceof Error
        ? error.message
        : String(error)

    console.error(`[ai-summary] Failed to generate summary: ${message}`)
    return 'AI threat summary is temporarily unavailable.'
  }
}

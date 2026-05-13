import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { allowMethods, withErrorHandling } from './_lib/http.js'
import { requireAuth } from './_lib/guards.js'
import { generateThreatSummary } from './_lib/gemini.js'

const schema = z.object({ scan: z.record(z.string(), z.unknown()) })

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  await requireAuth(req)
  const { scan } = schema.parse(req.body || {})
  const summary = await generateThreatSummary(scan)
  res.status(200).json({ summary })
})

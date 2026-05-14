import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { allowMethods, withErrorHandling } from '../lib/api/http.js'
import { requireAuth } from '../lib/api/guards.js'
import { generateThreatSummary } from '../lib/api/gemini.js'

const schema = z.object({ scan: z.record(z.string(), z.unknown()) })

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  await requireAuth(req)
  const { scan } = schema.parse(req.body || {})
  const summary = await generateThreatSummary(scan)
  res.status(200).json({ summary })
})

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { allowMethods, withErrorHandling } from './_lib/http'
import { requireAuth } from './_lib/guards'
import { generateThreatSummary } from './_lib/gemini'

const schema = z.object({ scan: z.record(z.unknown()) })

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  await requireAuth(req)
  const { scan } = schema.parse(req.body || {})
  const summary = await generateThreatSummary(scan)
  res.status(200).json({ summary })
})

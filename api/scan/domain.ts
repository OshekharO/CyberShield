import type { VercelRequest, VercelResponse } from '@vercel/node'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { requireAuth } from '../_lib/guards.js'
import { targetSchema } from '../_lib/validation.js'
import { runScan } from '../_lib/scan-service.js'
import { sanitizeInput } from '../_lib/security.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  const user = await requireAuth(req)
  const parsed = targetSchema.parse(req.body || {})
  const data = await runScan(user.id, 'domain', sanitizeInput(parsed.target))
  res.status(200).json(data)
})

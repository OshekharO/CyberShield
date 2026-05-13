import type { VercelRequest, VercelResponse } from '@vercel/node'
import { allowMethods, withErrorHandling } from '../_lib/http'
import { requireAuth } from '../_lib/guards'
import { targetSchema } from '../_lib/validation'
import { runScan } from '../_lib/scan-service'
import { sanitizeInput } from '../_lib/security'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  const user = await requireAuth(req)
  const parsed = targetSchema.parse(req.body || {})
  const data = await runScan(user.id, 'ip', sanitizeInput(parsed.target))
  res.status(200).json(data)
})

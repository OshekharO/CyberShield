import type { VercelRequest, VercelResponse } from '@vercel/node'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { requireAuth } from '../_lib/guards.js'
import { targetSchema } from '../_lib/validation.js'
import { runScan } from '../_lib/scan-service.js'
import { sanitizeInput } from '../_lib/security.js'

type ScanType = 'ip' | 'url' | 'email' | 'domain'

const isScanType = (value: string): value is ScanType =>
  value === 'ip' || value === 'url' || value === 'email' || value === 'domain'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  const user = await requireAuth(req)
  const parsed = targetSchema.parse(req.body || {})

  const type = req.query.type
  const scanType = Array.isArray(type) ? type[0] : type
  if (!scanType || !isScanType(scanType)) {
    const err = new Error('Invalid scan type')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }

  const data = await runScan(user.id, scanType, sanitizeInput(parsed.target))
  res.status(200).json(data)
})

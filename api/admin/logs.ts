import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, withErrorHandling } from '../../lib/api/http.js'
import { requireAuth, requireRole } from '../../lib/api/guards.js'
import { prisma } from '../../lib/api/db.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

  const logs = await prisma.apiLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  res.status(200).json(logs)
})

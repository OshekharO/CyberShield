import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, withErrorHandling } from '../_lib/http'
import { requireAuth, requireRole } from '../_lib/guards'
import { prisma } from '../_lib/db'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

  const logs = await prisma.apiLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  res.status(200).json(logs)
})

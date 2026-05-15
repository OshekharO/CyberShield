import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { requireAuth, requireRole } from '../_lib/guards.js'
import { prisma } from '../_lib/db.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

  const [users, scans, highRiskScans] = await Promise.all([
    prisma.user.count(),
    prisma.scan.count(),
    prisma.scan.count({ where: { riskScore: { gte: 65 } } }),
  ])

  res.status(200).json({
    users,
    scans,
    highRiskScans,
  })
})

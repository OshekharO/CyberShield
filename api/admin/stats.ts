import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { requireAuth, requireRole } from '../_lib/guards.js'
import { prisma } from '../_lib/db.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

  const [users, scans, highRiskScans, logs] = await Promise.all([
    prisma.user.count(),
    prisma.scan.count(),
    prisma.scan.count({ where: { riskScore: { gte: 65 } } }),
    prisma.apiLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
  ])

  const providerHealth = logs.reduce<Record<string, { count: number; errors: number }>>((acc, log) => {
    const name = log.providerName || 'platform'
    acc[name] = acc[name] || { count: 0, errors: 0 }
    acc[name].count += 1
    if (log.statusCode >= 400) acc[name].errors += 1
    return acc
  }, {})

  res.status(200).json({
    users,
    scans,
    highRiskScans,
    providerHealth,
    recentLogs: logs,
  })
})

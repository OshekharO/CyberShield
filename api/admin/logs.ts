import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, parsePagination, setPrivateCache, withErrorHandling } from '../_lib/http.js'
import { requireAuth, requireRole } from '../_lib/guards.js'
import { prisma } from '../_lib/db.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

  const { page, limit, skip } = parsePagination(req, { page: 1, limit: 50, maxLimit: 200 })
  const [logs, total] = await Promise.all([
    prisma.apiLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        endpoint: true,
        method: true,
        statusCode: true,
        providerName: true,
        latencyMs: true,
        createdAt: true,
      },
    }),
    prisma.apiLog.count(),
  ])
  setPrivateCache(res, 15, 30)
  res.status(200).json({
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  })
})

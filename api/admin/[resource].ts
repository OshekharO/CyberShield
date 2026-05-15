import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { requireAuth, requireRole } from '../_lib/guards.js'
import { prisma } from '../_lib/db.js'

// ── /api/admin/stats ──────────────────────────────────────────────────────────
async function handleStats(req: VercelRequest, res: VercelResponse) {
  allowMethods(['GET'], req)

  const [users, scans, highRiskScans] = await Promise.all([
    prisma.user.count(),
    prisma.scan.count(),
    prisma.scan.count({ where: { riskScore: { gte: 65 } } }),
  ])

  res.status(200).json({ users, scans, highRiskScans })
}

// ── /api/admin/logs ───────────────────────────────────────────────────────────
async function handleLogs(req: VercelRequest, res: VercelResponse) {
  allowMethods(['GET'], req)

  const pageRaw = Array.isArray(req.query.page) ? req.query.page[0] : req.query.page
  const pageSizeRaw = Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize
  const includeProviderHealthRaw = Array.isArray(req.query.includeProviderHealth)
    ? req.query.includeProviderHealth[0]
    : req.query.includeProviderHealth
  const page = Math.max(1, Number.parseInt(String(pageRaw || '1'), 10) || 1)
  const pageSize = Math.min(200, Math.max(1, Number.parseInt(String(pageSizeRaw || '50'), 10) || 50))
  const includeProviderHealth = String(includeProviderHealthRaw || '').toLowerCase() === 'true'

  const [total, logs] = await Promise.all([
    prisma.apiLog.count(),
    prisma.apiLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
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
  ])

  const payload: {
    logs: typeof logs
    pagination: { total: number; page: number; pageSize: number; totalPages: number }
    providerHealth?: Record<string, { count: number; errors: number }>
  } = {
    logs,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  }

  if (includeProviderHealth) {
    const [providerCounts, providerErrors] = await Promise.all([
      prisma.apiLog.groupBy({ by: ['providerName'], _count: { _all: true } }),
      prisma.apiLog.groupBy({
        by: ['providerName'],
        where: { statusCode: { gte: 400 } },
        _count: { _all: true },
      }),
    ])

    const providerHealth: Record<string, { count: number; errors: number }> = {}
    for (const item of providerCounts) {
      const name = item.providerName || 'platform'
      providerHealth[name] = { count: item._count._all, errors: 0 }
    }
    for (const item of providerErrors) {
      const name = item.providerName || 'platform'
      providerHealth[name] = providerHealth[name] || { count: 0, errors: 0 }
      providerHealth[name].errors = item._count._all
    }

    payload.providerHealth = providerHealth
  }

  res.status(200).json(payload)
}

// ── /api/admin/users ──────────────────────────────────────────────────────────
async function handleUsers(req: VercelRequest, res: VercelResponse, adminId: string) {
  allowMethods(['GET', 'POST'], req)

  const pageRaw = Array.isArray(req.query.page) ? req.query.page[0] : req.query.page
  const pageSizeRaw = Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize
  const page = Math.max(1, Number.parseInt(String(pageRaw || '1'), 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(String(pageSizeRaw || '25'), 10) || 25))

  if (req.method === 'POST') {
    const { userId, ban, reason } = (req.body || {}) as {
      userId?: string
      ban?: boolean
      reason?: string
    }

    if (!userId) {
      res.status(400).json({ error: 'userId is required' })
      return
    }

    await prisma.user.update({ where: { id: userId }, data: { isBanned: Boolean(ban) } })
    if (ban) {
      await prisma.blockedUser.upsert({
        where: { userId },
        update: { reason: reason || 'Policy violation', blockedById: adminId },
        create: { userId, blockedById: adminId, reason: reason || 'Policy violation' },
      })
    } else {
      await prisma.blockedUser.deleteMany({ where: { userId } })
    }
  }

  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isBanned: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  res.status(200).json({
    users,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  })
}

// ── Router ────────────────────────────────────────────────────────────────────
export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

  const resource = Array.isArray(req.query.resource) ? req.query.resource[0] : req.query.resource

  if (resource === 'stats') return handleStats(req, res)
  if (resource === 'logs') return handleLogs(req, res)
  if (resource === 'users') return handleUsers(req, res, user.id)

  res.status(404).json({ error: 'Unknown admin resource' })
})

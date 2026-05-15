import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { requireAuth, requireRole } from '../_lib/guards.js'
import { prisma } from '../_lib/db.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET', 'POST'], req)
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

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
        update: { reason: reason || 'Policy violation', blockedById: user.id },
        create: {
          userId,
          blockedById: user.id,
          reason: reason || 'Policy violation',
        },
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
})

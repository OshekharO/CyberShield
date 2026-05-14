import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, parsePagination, setPrivateCache, withErrorHandling } from '../_lib/http.js'
import { requireAuth, requireRole } from '../_lib/guards.js'
import { prisma } from '../_lib/db.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET', 'POST'], req)
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

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

    res.status(200).json({ ok: true })
    return
  }

  const { page, limit, skip } = parsePagination(req, { page: 1, limit: 25, maxLimit: 100 })
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isBanned: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ])

  setPrivateCache(res, 15, 30)
  res.status(200).json({
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  })
})

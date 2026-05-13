import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, withErrorHandling } from '../_lib/http'
import { requireAuth, requireRole } from '../_lib/guards'
import { prisma } from '../_lib/db'

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
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isBanned: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  res.status(200).json(users)
})

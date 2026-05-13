import type { UserRole } from '@prisma/client'
import type { VercelRequest } from '@vercel/node'
import { getAuthTokenFromCookie, verifyToken } from './auth.js'
import { prisma } from './db.js'

export const requireAuth = async (req: VercelRequest) => {
  const token = getAuthTokenFromCookie(req)
  if (!token) {
    const err = new Error('Unauthorized')
    ;(err as Error & { status?: number }).status = 401
    throw err
  }

  const payload = verifyToken(token)
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user || user.isBanned) {
    const err = new Error('Access denied')
    ;(err as Error & { status?: number }).status = 403
    throw err
  }

  return user
}

export const requireRole = (role: UserRole, userRole: UserRole) => {
  if (role !== userRole) {
    const err = new Error('Forbidden')
    ;(err as Error & { status?: number }).status = 403
    throw err
  }
}

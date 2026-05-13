import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authSchema } from '../_lib/validation'
import { allowMethods, withErrorHandling } from '../_lib/http'
import { prisma } from '../_lib/db'
import { comparePassword, setAuthCookie, signToken } from '../_lib/auth'
import { sanitizeObject } from '../_lib/security'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  const body = sanitizeObject((req.body || {}) as Record<string, unknown>)
  const parsed = authSchema.parse(body)

  const user = await prisma.user.findUnique({ where: { email: parsed.email } })
  if (!user || user.isBanned) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const match = await comparePassword(parsed.password, user.passwordHash)
  if (!match) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const token = signToken({ userId: user.id, role: user.role })
  setAuthCookie(res, token)

  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
})

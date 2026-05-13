import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authSchema } from '../_lib/validation'
import { allowMethods, withErrorHandling } from '../_lib/http'
import { prisma } from '../_lib/db'
import { hashPassword, setAuthCookie, signToken } from '../_lib/auth'
import { sanitizeObject } from '../_lib/security'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  const body = sanitizeObject((req.body || {}) as Record<string, unknown>)
  const parsed = authSchema.parse(body)

  const exists = await prisma.user.findUnique({ where: { email: parsed.email } })
  if (exists) {
    res.status(409).json({ error: 'Email already exists' })
    return
  }

  const passwordHash = await hashPassword(parsed.password)
  const user = await prisma.user.create({
    data: {
      email: parsed.email,
      passwordHash,
      name: parsed.name || parsed.email.split('@')[0],
    },
  })

  const token = signToken({ userId: user.id, role: user.role })
  setAuthCookie(res, token)

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
})

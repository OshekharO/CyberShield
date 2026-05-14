import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Prisma } from '@prisma/client'
import { authSchema } from '../../lib/api/validation.js'
import { allowMethods, withErrorHandling } from '../../lib/api/http.js'
import { prisma } from '../../lib/api/db.js'
import { hashPassword, setAuthCookie, signToken } from '../../lib/api/auth.js'
import { sanitizeObject } from '../../lib/api/security.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  const body = sanitizeObject((req.body || {}) as Record<string, unknown>)
  const parsed = authSchema.parse(body)

  try {
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
  } catch (error) {
    if (
      (error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2021' || error.code === 'P2022')) ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      const dbError = new Error('Database is not initialized. Run Prisma migrations on Supabase and retry.')
      ;(dbError as Error & { status?: number }).status = 500
      throw dbError
    }

    throw error
  }
})

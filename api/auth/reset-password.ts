import { createHash } from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { prisma } from '../_lib/db.js'
import { hashPassword } from '../_lib/auth.js'
import { sanitizeObject } from '../_lib/security.js'

const schema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(72),
})

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  const body = sanitizeObject((req.body || {}) as Record<string, unknown>)
  const { token, newPassword } = schema.parse(body)

  const tokenHash = createHash('sha256').update(token).digest('hex')

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  })

  if (!resetToken || resetToken.expiresAt < new Date()) {
    const err = new Error('Invalid or expired reset token.')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }

  const passwordHash = await hashPassword(newPassword)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({ where: { tokenHash } }),
  ])

  res.status(200).json({ message: 'Password updated successfully.' })
})

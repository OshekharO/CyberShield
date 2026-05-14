import { createHash, randomBytes } from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { prisma } from '../_lib/db.js'
import { sanitizeObject } from '../_lib/security.js'

const schema = z.object({ email: z.string().email() })

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 1 hour

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  const body = sanitizeObject((req.body || {}) as Record<string, unknown>)
  const { email } = schema.parse(body)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.isBanned) {
    // Return the same response whether or not the email exists to avoid enumeration
    res.status(200).json({ message: 'If the email exists, a reset link has been sent.' })
    return
  }

  // Remove any existing reset tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

  const rawToken = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(rawToken).digest('hex')
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS)

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  })

  const appUrl = process.env.APP_URL?.replace(/\/$/, '') ?? ''
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`

  res.status(200).json({
    message: 'If the email exists, a reset link has been sent.',
    // resetUrl is included here because no email provider is configured.
    // In production with an email service, remove this field and send it via email instead.
    resetUrl,
  })
})


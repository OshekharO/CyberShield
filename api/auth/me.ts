import type { VercelRequest, VercelResponse } from '@vercel/node'
import { allowMethods, withErrorHandling } from '../_lib/http.js'
import { requireAuth } from '../_lib/guards.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)
  const user = await requireAuth(req)
  res.status(200).json({ id: user.id, email: user.email, role: user.role, name: user.name })
})

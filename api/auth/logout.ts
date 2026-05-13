import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clearAuthCookie } from '../_lib/auth'
import { allowMethods, withErrorHandling } from '../_lib/http'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  clearAuthCookie(res)
  res.status(200).json({ success: true })
})

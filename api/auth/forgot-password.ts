import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { allowMethods, withErrorHandling } from '../_lib/http.js'

const schema = z.object({ email: z.string().email() })

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['POST'], req)
  schema.parse(req.body || {})
  res.status(200).json({ message: 'If the email exists, a reset flow has been initiated.' })
})

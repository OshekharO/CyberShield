import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  name: z.string().min(2).max(80).optional(),
})

export const targetSchema = z.object({
  target: z.string().min(1).max(320),
})

import type { UserRole } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env, requireEnv } from './env.js'

const COOKIE_NAME = 'cybershield_token'

export interface AuthToken {
  userId: string
  role: UserRole
}

export const hashPassword = async (password: string) => bcrypt.hash(password, 12)

export const comparePassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash)

export const signToken = (payload: AuthToken) => {
  const secret = requireEnv('JWT_SECRET')
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  const secret = requireEnv('JWT_SECRET')
  return jwt.verify(token, secret) as AuthToken
}

export const setAuthCookie = (res: VercelResponse, token: string) => {
  const secure = process.env.NODE_ENV === 'production'
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800; ${secure ? 'Secure;' : ''}`,
  )
}

export const clearAuthCookie = (res: VercelResponse) => {
  const secure = process.env.NODE_ENV === 'production'
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; ${secure ? 'Secure;' : ''}`,
  )
}

export const getAuthTokenFromCookie = (req: VercelRequest) => {
  const cookie = req.headers.cookie
  if (!cookie) return null
  const token = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1]
  return token || null
}

export const assertJwtSecret = () => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
}

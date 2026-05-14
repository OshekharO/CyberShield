import { api } from './api'
import type { User } from '../types'

export const authService = {
  signup: async (payload: { email: string; password: string; name: string }) => {
    const { data } = await api.post<User>('/api/auth/signup', payload)
    return data
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<User>('/api/auth/login', payload)
    return data
  },
  logout: async () => {
    await api.post('/api/auth/logout')
  },
  me: async () => {
    const { data } = await api.get<User>('/api/auth/me')
    return data
  },
  forgotPassword: async (email: string) => {
    const { data } = await api.post<{ message: string; resetUrl?: string }>('/api/auth/forgot-password', { email })
    return data
  },
  resetPassword: async (token: string, newPassword: string) => {
    const { data } = await api.post<{ message: string }>('/api/auth/reset-password', { token, newPassword })
    return data
  },
}

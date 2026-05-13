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
}

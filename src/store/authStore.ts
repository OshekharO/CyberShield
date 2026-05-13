import { create } from 'zustand'
import { authService } from '../services/authService'
import type { User } from '../types'

interface AuthState {
  user: User | null
  loading: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  signup: (payload: { email: string; password: string; name: string }) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  login: async (payload) => {
    const user = await authService.login(payload)
    set({ user })
  },
  signup: async (payload) => {
    const user = await authService.signup(payload)
    set({ user })
  },
  logout: async () => {
    await authService.logout()
    set({ user: null })
  },
  hydrate: async () => {
    try {
      const user = await authService.me()
      set({ user, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },
}))

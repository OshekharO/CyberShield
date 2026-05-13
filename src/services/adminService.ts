import { api } from './api'

export const adminService = {
  users: async () => (await api.get('/api/admin/users')).data,
  updateBanStatus: async (userId: string, ban: boolean) =>
    (await api.post('/api/admin/users', { userId, ban })).data,
  stats: async () => (await api.get('/api/admin/stats')).data,
  logs: async () => (await api.get('/api/admin/logs')).data,
}

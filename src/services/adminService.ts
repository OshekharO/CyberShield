import { api } from './api'

export const adminService = {
  users: async (page = 1, pageSize = 25) => (await api.get('/api/admin/users', { params: { page, pageSize } })).data,
  updateBanStatus: async (userId: string, ban: boolean) =>
    (await api.post('/api/admin/users', { userId, ban })).data,
  stats: async () => (await api.get('/api/admin/stats')).data,
  logs: async (page = 1, pageSize = 50, includeProviderHealth = false) =>
    (await api.get('/api/admin/logs', { params: { page, pageSize, includeProviderHealth } })).data,
  runRetentionCleanup: async () => (await api.get('/api/maintenance/retention')).data,
}

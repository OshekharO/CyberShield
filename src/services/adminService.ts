import { api } from './api'

interface PaginationQuery {
  page?: number
  limit?: number
}

export const adminService = {
  users: async ({ page = 1, limit = 25 }: PaginationQuery = {}) =>
    (await api.get('/api/admin/users', { params: { page, limit } })).data,
  updateBanStatus: async (userId: string, ban: boolean) =>
    (await api.post('/api/admin/users', { userId, ban })).data,
  stats: async () => (await api.get('/api/admin/stats')).data,
  logs: async ({ page = 1, limit = 50 }: PaginationQuery = {}) =>
    (await api.get('/api/admin/logs', { params: { page, limit } })).data,
}

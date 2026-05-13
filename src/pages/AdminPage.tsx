import { useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

interface AdminUser {
  id: string
  name: string
  role: string
  email: string
  isBanned: boolean
}

interface AdminStats {
  users: number
  scans: number
  highRiskScans: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)

  const load = async () => {
    const [loadedUsers, loadedStats] = await Promise.all([adminService.users(), adminService.stats()])
    setUsers(loadedUsers as AdminUser[])
    setStats(loadedStats as AdminStats)
  }

  useEffect(() => {
    let active = true

    const loadInitial = async () => {
      const [loadedUsers, loadedStats] = await Promise.all([adminService.users(), adminService.stats()])
      if (!active) return
      setUsers(loadedUsers as AdminUser[])
      setStats(loadedStats as AdminStats)
    }

    void loadInitial()
    return () => {
      active = false
    }
  }, [])

  const toggleBan = async (userId: string, ban: boolean) => {
    await adminService.updateBanStatus(userId, ban)
    await load()
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin Analytics</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Users</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{stats?.users ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Scans</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{stats?.scans ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">High Risk</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{stats?.highRiskScans ?? 0}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">User Management</h3>
        <div className="mt-3 space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/50"
            >
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  {user.name} ({user.role})
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toggleBan(user.id, !user.isBanned)}>
                {user.isBanned ? 'Unban' : 'Ban'} user
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { adminService } from '../services/adminService'

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
    const [u, s] = await Promise.all([adminService.users(), adminService.stats()])
    setUsers(u as AdminUser[])
    setStats(s as AdminStats)
  }

  useEffect(() => {
    let active = true

    const loadInitial = async () => {
      const [u, s] = await Promise.all([adminService.users(), adminService.stats()])
      if (!active) return
      setUsers(u as AdminUser[])
      setStats(s as AdminStats)
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5">
        <h2 className="text-lg font-semibold text-cyan-300">Admin Analytics</h2>
        <p className="mt-2 text-sm text-slate-300">
          Users: {stats?.users ?? 0} | Scans: {stats?.scans ?? 0} | High Risk: {stats?.highRiskScans ?? 0}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5">
        <h3 className="font-semibold text-cyan-300">User Management</h3>
        <div className="mt-3 space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-xl border border-slate-700/60 p-3">
              <div>
                <p>
                  {u.name} ({u.role})
                </p>
                <p className="text-xs text-slate-400">{u.email}</p>
              </div>
              <button className="text-sm text-cyan-300" onClick={() => toggleBan(u.id, !u.isBanned)}>
                {u.isBanned ? 'Unban' : 'Ban'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

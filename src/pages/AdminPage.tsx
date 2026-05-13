import { useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Button } from '../components/ui/button'
import { HUDHeader } from '../components/ui/hud-header'
import { DataRow } from '../components/ui/data-row'
import { TerminalBlock } from '../components/ui/terminal-block'

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
    <div className="space-y-6">
      <SurfacePanel className="space-y-4">
        <HUDHeader title="Admin analytics" subtitle="Monitor user totals, scan volume, and high-risk concentration across the platform." />
        <div className="grid gap-4 sm:grid-cols-3">
          <TerminalBlock>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-content/70">Users</p>
            <p className="mt-2 text-3xl font-semibold">{stats?.users ?? 0}</p>
          </TerminalBlock>
          <TerminalBlock>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-content/70">Scans</p>
            <p className="mt-2 text-3xl font-semibold">{stats?.scans ?? 0}</p>
          </TerminalBlock>
          <TerminalBlock>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-content/70">High risk</p>
            <p className="mt-2 text-3xl font-semibold">{stats?.highRiskScans ?? 0}</p>
          </TerminalBlock>
        </div>
      </SurfacePanel>

      <SurfacePanel className="space-y-4">
        <HUDHeader title="User management" subtitle="Review accounts and apply access enforcement actions from one list." />
        <div className="space-y-3">
          {users.map((user) => (
            <DataRow
              key={user.id}
              title={`${user.name} (${user.role})`}
              subtitle={user.email}
              action={
                <Button variant={user.isBanned ? 'outline' : 'danger'} size="sm" onClick={() => toggleBan(user.id, !user.isBanned)}>
                  {user.isBanned ? 'Unban' : 'Ban'} user
                </Button>
              }
            />
          ))}
          {users.length === 0 ? <div className="alert">No user records available.</div> : null}
        </div>
      </SurfacePanel>
    </div>
  )
}

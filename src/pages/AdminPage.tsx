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
    <div className="stack-4">
      <SurfacePanel>
        <HUDHeader title="Admin Analytics" subtitle="Track governance, scan volume, and risk concentration." glitch />
        <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <TerminalBlock>
            <p className="cyber-label">Users</p>
            <p className="metric-value" style={{ marginTop: '0.35rem' }}>
              {stats?.users ?? 0}
            </p>
          </TerminalBlock>
          <TerminalBlock>
            <p className="cyber-label">Scans</p>
            <p className="metric-value" style={{ marginTop: '0.35rem' }}>
              {stats?.scans ?? 0}
            </p>
          </TerminalBlock>
          <TerminalBlock>
            <p className="cyber-label">High Risk</p>
            <p className="metric-value" style={{ marginTop: '0.35rem' }}>
              {stats?.highRiskScans ?? 0}
            </p>
          </TerminalBlock>
        </div>
      </SurfacePanel>

      <SurfacePanel>
        <HUDHeader title="User Management" subtitle="Review and enforce account access controls." />
        <div className="stack-2 mt-3">
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
        </div>
      </SurfacePanel>
    </div>
  )
}

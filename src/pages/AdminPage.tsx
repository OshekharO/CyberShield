import { useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Button } from '../components/ui/button'
import { HUDHeader } from '../components/ui/hud-header'
import { DataRow } from '../components/ui/data-row'

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

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const load = async () => {
    const [loadedUsers, loadedStats] = await Promise.all([adminService.users(page, 25), adminService.stats()])
    setUsers((loadedUsers as { users: AdminUser[] }).users)
    setPagination((loadedUsers as { pagination: PaginationInfo }).pagination)
    setStats(loadedStats as AdminStats)
  }

  useEffect(() => {
    let active = true

    const loadInitial = async () => {
      const [loadedUsers, loadedStats] = await Promise.all([adminService.users(page, 25), adminService.stats()])
      if (!active) return
      setUsers((loadedUsers as { users: AdminUser[] }).users)
      setPagination((loadedUsers as { pagination: PaginationInfo }).pagination)
      setStats(loadedStats as AdminStats)
    }

    void loadInitial()
    return () => {
      active = false
    }
  }, [page])

  const toggleBan = async (userId: string, ban: boolean) => {
    await adminService.updateBanStatus(userId, ban)
    await load()
  }

  return (
    <div className="stack-4">
      <SurfacePanel>
        <HUDHeader title="Administrative Governance" subtitle="Track user accounts, indicator scan volume, and threat concentration." />
        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="hud-panel">
            <p className="cyber-label">Registered Accounts</p>
            <p className="metric-value" style={{ marginTop: '0.35rem' }}>
              {stats?.users ?? 0}
            </p>
          </div>
          <div className="hud-panel">
            <p className="cyber-label">Total Indicator Scans</p>
            <p className="metric-value" style={{ marginTop: '0.35rem' }}>
              {stats?.scans ?? 0}
            </p>
          </div>
          <div className="hud-panel">
            <p className="cyber-label">Critical / High Alerts</p>
            <p className="metric-value" style={{ marginTop: '0.35rem' }}>
              {stats?.highRiskScans ?? 0}
            </p>
          </div>
        </div>
      </SurfacePanel>

      <SurfacePanel>
        <div className="row-between" style={{ marginBottom: '0.75rem' }}>
          <HUDHeader title="User Access Directory" subtitle="Manage account activation, roles, and administrative bans." />
          <span className="live-tag brand">RBAC Control</span>
        </div>
        <div className="stack-2 mt-3">
          {users.map((user) => (
            <DataRow
              key={user.id}
              title={`${user.name} [${user.role}]`}
              subtitle={user.email}
              action={
                <Button variant={user.isBanned ? 'outline' : 'danger'} size="sm" onClick={() => toggleBan(user.id, !user.isBanned)}>
                  {user.isBanned ? 'Unban Account' : 'Revoke Access'}
                </Button>
              }
            />
          ))}
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <p className="helper-text">
            Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1} ({pagination?.total ?? 0} users total)
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" size="sm" disabled={(pagination?.page ?? 1) <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(pagination?.page ?? 1) >= (pagination?.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </SurfacePanel>
    </div>
  )
}

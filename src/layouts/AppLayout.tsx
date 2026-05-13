import { NavLink, Outlet } from 'react-router-dom'
import { Activity, FileSpreadsheet, LayoutDashboard, ScanSearch, Settings, Shield, Users } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { SurfacePanel } from '../components/ui/surface-panel'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/scan-center', label: 'Scan Center', icon: ScanSearch },
  { to: '/threat-feed', label: 'Threat Feed', icon: Activity },
  { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="app-shell">
      <div className="navbar border-b border-base-300/60 bg-base-100/80 px-4 backdrop-blur lg:px-8">
        <div className="flex-1 gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-box bg-primary/15 text-primary">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CyberShield</p>
            <h1 className="text-lg font-semibold">Security Workspace</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-4">
          <SurfacePanel className="p-0">
            <div className="border-b border-base-300/60 p-5">
              <p className="text-sm font-medium text-base-content/70">Operations menu</p>
              <p className="mt-1 text-xs text-base-content/50">Navigate scans, reports, and governance controls.</p>
            </div>
            <ul className="menu gap-1 p-3">
              {links.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => (isActive ? 'active bg-primary text-primary-content' : '')}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
              {user?.role === 'ADMIN' && (
                <li>
                  <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active bg-primary text-primary-content' : '')}>
                    <Users size={16} />
                    <span>Admin</span>
                  </NavLink>
                </li>
              )}
            </ul>
          </SurfacePanel>

          <SurfacePanel className="space-y-3 p-5">
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-sm text-base-content/60">{user?.email}</p>
            </div>
            <div className="badge badge-outline">{user?.role ?? 'USER'}</div>
            <Button type="button" variant="ghost" className="justify-start" onClick={() => void logout()}>
              Sign out
            </Button>
          </SurfacePanel>
        </aside>

        <main className="min-w-0 space-y-6">
          <SurfacePanel className="mesh-bg p-5">
            <p className="text-sm text-base-content/70">Real-time scanning, triage, and reporting for your cyber operations workflow.</p>
          </SurfacePanel>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

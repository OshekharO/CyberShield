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
      <div className="navbar sticky top-0 z-20 border-b border-base-300/60 bg-base-100/75 px-4 backdrop-blur-xl lg:px-8">
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
          <div className="badge badge-outline hidden sm:inline-flex">Live ops</div>
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <SurfacePanel className="glass-panel p-0">
            <div className="border-b border-base-300/60 p-5">
              <p className="text-sm font-medium text-base-content/70">Operations menu</p>
              <p className="mt-1 text-xs text-base-content/50">Navigate scans, reports, governance, and response workflows.</p>
            </div>
            <ul className="menu gap-1 p-3">
              {links.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      isActive ? 'active bg-primary text-primary-content shadow-[0_0_20px_rgba(0,212,255,0.18)]' : 'hover:bg-base-200/70'
                    }
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
              {user?.role === 'ADMIN' && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive ? 'active bg-primary text-primary-content shadow-[0_0_20px_rgba(0,212,255,0.18)]' : 'hover:bg-base-200/70'
                    }
                  >
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
            <div className="flex flex-wrap gap-2">
              <div className="badge badge-outline">{user?.role ?? 'USER'}</div>
              <div className="badge badge-accent badge-outline">Secure session</div>
            </div>
            <Button type="button" variant="ghost" className="justify-start" onClick={() => void logout()}>
              Sign out
            </Button>
          </SurfacePanel>
        </aside>

        <main className="min-w-0 space-y-6">
          <SurfacePanel className="mesh-bg p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold">Command center</p>
                <p className="mt-1 text-sm text-base-content/70">Real-time scanning, triage, and reporting for your cyber operations workflow.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-base-content/70">
                <span className="badge badge-outline">Detection</span>
                <span className="badge badge-outline">Triage</span>
                <span className="badge badge-outline">Reporting</span>
              </div>
            </div>
          </SurfacePanel>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

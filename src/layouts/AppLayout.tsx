import { NavLink, Outlet } from 'react-router-dom'
import { Activity, FileSpreadsheet, LayoutDashboard, ScanSearch, Settings, Shield, Users } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { GlitchText } from '../components/ui/glitch-text'
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
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-5">
        <SurfacePanel className="scanline-overlay p-4 sm:p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-auto">
          <div className="mb-6 flex items-center justify-between gap-2">
            <div>
              <p className="cyber-label">CyberShield</p>
              <h1 className="cyber-title mt-1 flex items-center gap-2 text-lg font-semibold">
                <Shield size={16} className="text-sky-400" />
                <GlitchText text="OPERATIONS" className="inline-block" />
              </h1>
            </div>
            <ThemeToggle />
          </div>

          <nav className="space-y-1.5">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-sky-400/50 bg-sky-400/14 text-sky-700 dark:text-sky-100'
                      : 'border-transparent text-[var(--text-1)] hover:border-[var(--line)] hover:bg-[var(--brand-soft)] hover:text-[var(--text-0)]'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-sky-400/50 bg-sky-400/14 text-sky-700 dark:text-sky-100'
                      : 'border-transparent text-[var(--text-1)] hover:border-[var(--line)] hover:bg-[var(--brand-soft)] hover:text-[var(--text-0)]'
                  }`
                }
              >
                <Users size={16} />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="hud-panel mt-6">
            <p className="truncate text-sm font-medium text-[var(--text-0)]">{user?.name}</p>
            <p className="truncate text-xs text-[var(--text-2)]">{user?.email}</p>
            <Button type="button" variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </SurfacePanel>

        <main className="min-w-0 space-y-4">
          <header className="hero-gradient rounded-2xl border border-[var(--line-strong)] px-4 py-4 text-sm text-[var(--text-1)] shadow-[var(--shadow-soft)] sm:px-5">
            <p className="cyber-label">Live workspace</p>
            <p className="mt-1">Real-time threat scanning, triage, and reporting across your security operations workflow.</p>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

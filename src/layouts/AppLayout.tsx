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
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SurfacePanel className="scanline-overlay p-4 sm:p-5">
          <div className="mb-6 flex items-center justify-between gap-2">
            <div>
              <p className="cyber-label">CyberShield</p>
              <GlitchText
                as="h1"
                text="OPERATIONS"
                className="cyber-title mt-1 flex items-center gap-2 text-lg font-semibold tracking-[0.12em]"
              >
                <Shield size={16} className="text-cyan-300" />
                OPERATIONS
              </GlitchText>
            </div>
            <ThemeToggle />
          </div>

          <nav className="space-y-1.5">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm font-medium transition [clip-path:polygon(0.55rem_0,calc(100%-0.55rem)_0,100%_0.55rem,100%_calc(100%-0.55rem),calc(100%-0.55rem)_100%,0.55rem_100%,0_calc(100%-0.55rem),0_0.55rem)] ${
                    isActive
                      ? 'border border-cyan-300/55 bg-cyan-300/16 text-cyan-100 cyber-glow-cyan'
                      : 'border border-transparent text-[var(--text-1)] hover:border-cyan-300/30 hover:bg-cyan-300/8 hover:text-[var(--text-0)]'
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
                  `flex items-center gap-3 px-3 py-2 text-sm font-medium transition [clip-path:polygon(0.55rem_0,calc(100%-0.55rem)_0,100%_0.55rem,100%_calc(100%-0.55rem),calc(100%-0.55rem)_100%,0.55rem_100%,0_calc(100%-0.55rem),0_0.55rem)] ${
                    isActive
                      ? 'border border-cyan-300/55 bg-cyan-300/16 text-cyan-100 cyber-glow-cyan'
                      : 'border border-transparent text-[var(--text-1)] hover:border-cyan-300/30 hover:bg-cyan-300/8 hover:text-[var(--text-0)]'
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
          <header className="hud-panel text-sm text-[var(--text-1)]">Live security workspace for real-time threat scanning and reporting.</header>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

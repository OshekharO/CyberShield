import { NavLink, Outlet } from 'react-router-dom'
import { Activity, FileSpreadsheet, LayoutDashboard, ScanSearch, Settings, Shield, Users } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'

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
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-300/70 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-6 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">CyberShield</p>
              <h1 className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Shield size={16} className="text-cyan-500" />
                Operations
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
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
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
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
                  }`
                }
              >
                <Users size={16} />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="mt-6 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            <Button type="button" variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 space-y-4">
          <header className="rounded-2xl border border-slate-300/70 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            Live security workspace for real-time threat scanning and reporting.
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

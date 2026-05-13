import { NavLink, Outlet } from 'react-router-dom'
import { Shield, ScanSearch, Activity, FileSpreadsheet, Settings, Users } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuthStore } from '../store/authStore'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Shield },
  { to: '/scan-center', label: 'Scan Center', icon: ScanSearch },
  { to: '/threat-feed', label: 'Threat Feed', icon: Activity },
  { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-4 md:grid-cols-[260px_minmax(0,1fr)] md:py-6">
        <aside className="rounded-2xl border border-slate-700/60 bg-slate-900/75 p-4 backdrop-blur-md">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold text-cyan-300">CyberShield X</h1>
            <ThemeToggle />
          </div>
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={16} />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Users size={16} />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="mt-8 rounded-xl border border-slate-700/60 p-3 text-xs text-slate-300">
            <p className="truncate font-medium text-slate-100">{user?.name}</p>
            <p className="truncate">{user?.email}</p>
            <button type="button" onClick={() => void logout()} className="mt-3 text-cyan-300">
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
